import { test } from 'uvu'
import * as assert from 'uvu/assert'
import fs from 'node:fs/promises'
import { URL } from 'node:url'

import './_emscriptenWorkaround.js'
import { loadSpeexModule, SpeexPreprocessor } from '../src/index.js'

type HalfFrame = [number, number, number, number, number]
type Frame = [...HalfFrame, ...HalfFrame]
const FRAME_SIZE: Frame['length'] = 10

const speexModuleWasmBinary = await fs.readFile(
  new URL('../wasm-out/speex.wasm', import.meta.url)
)
const speexModule = await loadSpeexModule({
  wasmBinary: speexModuleWasmBinary
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
    [0.0003986358642578125, 0, 0, 0, 0, 1, 1, 1, 1, 1]
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0.4765625, 0.4765625, 0.4765625, 0.4765625, 0.4765625, 0, 0, 0, 0, 0]
  ]
]

for (const [i, c] of cases.entries()) {
  test(`SpeexPreprocessor.process: ${i}`, () => {
    process(c[0], c[1])
  })
}

test.run()
