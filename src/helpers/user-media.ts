import deepMerge from 'deepmerge'

const { mediaDevices } = navigator

async function requestUserMedia(constrains: MediaStreamConstraints) {
  return await mediaDevices.getUserMedia(constrains)
}

export async function getAllMediaDevices() {
  return navigator.mediaDevices.enumerateDevices()
}

export function getSupportedConstraints() {
  return mediaDevices.getSupportedConstraints()
}

export async function requestUserAudio(audioTrackConstraints?: boolean | MediaTrackConstraints) {
  const isTrackConstraintsUndefined = typeof audioTrackConstraints === 'undefined'
  const isTrackConstraintsBoolean = typeof audioTrackConstraints === 'boolean'

  const defaultAudioTrackConstraints: MediaTrackConstraints = {
    echoCancellation: true,
    noiseSuppression: true,
  }

  const audioConstraints = isTrackConstraintsUndefined
    ? defaultAudioTrackConstraints
    : isTrackConstraintsBoolean
    ? true
    : deepMerge(defaultAudioTrackConstraints, audioTrackConstraints as MediaTrackConstraints)

  return await requestUserMedia({ audio: audioConstraints })
}
