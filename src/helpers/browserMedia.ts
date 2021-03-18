import adapter from 'webrtc-adapter'

export const userMedia = () => {
  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    navigator['mediaDevices'] = {}
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = (constraints) => {
      // First get ahold of the legacy getUserMedia, if present
      const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise((resolve, reject) => {
        getUserMedia.call(navigator, constraints, resolve, reject)
      })
    }
  }

  return adapter.browserDetails.browser
}

// export function requestBrowserMedia() {
//   if (navigator.getUserMedia) {
//     navigator.getUserMedia(
//       { audio: true, video: { width: 1280, height: 720 } },
//       function (stream) {
//         var video = document.querySelector('video')
//         video.srcObject = stream
//         video.onloadedmetadata = function (e) {
//           video.play()
//         }
//       },
//       (err) => {
//         console.log('The following error occurred: ' + err.name)
//       }
//     )
//   } else {
//     console.log('getUserMedia not supported')
//   }
// }

// export function requestUserAudio() {}