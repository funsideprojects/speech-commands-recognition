import R from 'react'
import * as tf from '@tensorflow/tfjs'
import * as speechCommands from '@tensorflow-models/speech-commands'

import { userMedia } from 'helpers'

function App() {
  const [model, setModel] = R.useState<speechCommands.SpeechCommandRecognizer | undefined>(undefined)
  const [actions, setActions] = R.useState(undefined)
  const [labels, setLabels] = R.useState<Array<string>>([])

  const loadModel = async () => {
    const recognizer = await speechCommands.create('BROWSER_FFT')
    await recognizer.ensureModelLoaded().catch((er) => {
      console.log(er)
    })
    setModel(recognizer)
    setLabels(recognizer.wordLabels())
  }

  const recognizeCommands = async () => {
    model?.listen(
      async (result) => {
        console.log(result.scores)
      },
      {
        includeSpectrogram: true,
        // ? Try changing threshold, the lower number => the more flexible model
        probabilityThreshold: 0.9,
      }
    )
  }

  R.useEffect(() => {
    loadModel()
  }, [])

  return <div>a</div>
}

export default App
