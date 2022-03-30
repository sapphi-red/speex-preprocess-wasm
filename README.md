# @sapphi-red/speex-preprocess-wasm

[![npm version](https://badge.fury.io/js/@sapphi-red%2Fspeex-preprocess-wasm.svg)](https://badge.fury.io/js/@sapphi-red%2Fspeex-preprocess-wasm) ![CI](https://github.com/sapphi-red/speex-preprocess-wasm/workflows/CI/badge.svg)

WebAssembly build of [SpeexDSP preprocess](https://github.com/xiph/speexdsp/blob/master/include/speex/speex_preprocess.h).

## Install
```shell
npm i @sapphi-red/speex-preprocess-wasm # yarn add @sapphi-red/speex-preprocess-wasm
```

## Usage
```ts
import { loadSpeexModule, SpeexPreprocessor } from '@sapphi-red/speex-preprocess-wasm'

const speexModule = await loadSpeexModule()
const bufferSize = 128
const sampleRate = 44100
const speexPreprocessor = new SpeexPreprocessor(speexModule, bufferSize, sampleRate)
```
