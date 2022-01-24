import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { URL, fileURLToPath } from 'node:url'

import './_emscriptenWorkaround.js'
import { loadSpeexModule, SpeexPreprocessor } from '../src/index.js'

type HalfFrame = [number, number, number, number, number]
type Frame = [...HalfFrame, ...HalfFrame]
const FRAME_SIZE: Frame['length'] = 10

const speexModule = await loadSpeexModule({
  locateFile: () =>
    fileURLToPath(new URL('../wasm-out/speex.wasm', import.meta.url))
})
const preprocessor = new SpeexPreprocessor(speexModule, FRAME_SIZE, 44100)

const process = (input: Frame, expected: Frame) => {
  const tArr = new Float32Array(input)
  preprocessor.process(tArr)
  assert.equal([...tArr], expected)
}

const cases: Array<[Frame, Frame]> = [
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0.9103671312332153, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [
      0.9913938045501709, 0.9913938045501709, 0.9913938045501709,
      0.9913938045501709, 0.9913938045501709, 0.9913938045501709,
      0.9913938045501709, 0.9913938045501709, 0.9913938045501709,
      0.9913938045501709
    ]
  ]
]
for (const [i, c] of cases.entries()) {
  test(`SpeexPreprocessor.process: ${i}`, () => {
    process(c[0], c[1])
  })
}

const toggleTests = ['denoise', 'agc', 'vad'] as const
for (const toggleTest of toggleTests) {
  test(`SpeexPreprocessor.${toggleTest}`, () => {
    preprocessor[toggleTest] = false
    assert.is(preprocessor[toggleTest], false)

    preprocessor[toggleTest] = true
    assert.is(preprocessor[toggleTest], true)
  })
}

const numberTests = [
  ['agcLevel', [1, 4]],
  ['probStart', [1, 0]],
  ['probContinue', [1, 0]],
  ['noiseSuppress', [-1, 0]],
  ['echoSuppress', [-1, 0]],
  ['echoSuppressActive', [-1, 0]],
  ['agcIncrement', [-1, 0]],
  ['agcMaxGain', [-1, 0]],
  ['agcTarget', [1, 4]]
] as const
for (const [numberTest, cases] of numberTests) {
  test(`SpeexPreprocessor.${numberTest}`, () => {
    for (const c of cases) {
      preprocessor[numberTest] = c
      assert.is(preprocessor[numberTest], c)
    }
  })
}

const readonlyNumberTests = [
  'agcLoudness',
  'agcGain',
  'psdSize',
  'noisePsdSize',
  'prob'
] as const
for (const readonlyNumberTest of readonlyNumberTests) {
  test(`SpeexPreprocessor.${readonlyNumberTest}`, () => {
    assert.type(preprocessor[readonlyNumberTest], 'number')
  })
}

const readonlyIntArrayTests = [
  ['psd', 'psdSize'],
  ['noisePsd', 'noisePsdSize']
] as const
for (const readonlyIntArrayTest of readonlyIntArrayTests) {
  test(`SpeexPreprocessor.${readonlyIntArrayTest[0]}`, () => {
    const value = preprocessor[readonlyIntArrayTest[0]]
    const size = preprocessor[readonlyIntArrayTest[1]]

    assert.instance(value, Int32Array)
    assert.is(value.length, size)
  })
}

test.run()
