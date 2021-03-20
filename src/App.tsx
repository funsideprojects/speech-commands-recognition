import R from 'react'
import '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-backend-cpu'
import * as speechCommands from '@tensorflow-models/speech-commands'

import { requestUserAudio } from 'helpers'

function argMax(scores: Array<number>): number {
  return scores.map((score, index) => [score, index]).reduce((r, a) => (a[0] > r[0] ? a : r))[1]
}

function App() {
  const [model, setModel] = R.useState<speechCommands.SpeechCommandRecognizer | undefined>(undefined)
  const [actions, setActions] = R.useState<string>('')
  const [labels, setLabels] = R.useState<Array<string>>([])
  const [isListening, setIsListening] = R.useState<boolean>(false)

  const loadModel = async () => {
    const recognizer = speechCommands.create('BROWSER_FFT')
    try {
      await recognizer.ensureModelLoaded()
    } catch (error) {
      console.debug(error)
    }
    setModel(recognizer)
    setLabels(recognizer.wordLabels())
  }

  const start = async () => {
    await model!
      .listen(
        async (result) => {
          setActions(labels[argMax(Object.values(result.scores))])
        },
        {
          includeSpectrogram: true,
          // ? Try changing threshold, the lower number => the more flexible model
          probabilityThreshold: 0.8,
        }
      )
      .then(() => {
        setIsListening(true)
      })
  }

  const stop = async () => {
    await model!.stopListening().then(() => {
      setIsListening(false)
    })
  }

  R.useEffect(() => {
    loadModel()
    requestUserAudio()
  }, [])

  return (
    <div className="container">
      <button className="bg-green-600 focus:outline-none" onClick={isListening ? stop : start}>
        {isListening ? 'Stop' : 'Start'}
      </button>
      <div>{actions || 'No action detected'}</div>
    </div>
  )
}

export default App
