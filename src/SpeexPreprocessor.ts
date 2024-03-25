import {
  SpeexModule,
  SpeexPreprocessState,
  F32Ptr,
  I16Ptr,
  I32Ptr
} from '../wasm-out/speex'
import { SpeexPreprocessCtlRequest } from './SpeexPreprocessCtlRequest'

export type LoadOptions = Pick<SpeexModule, 'locateFile' | 'wasmBinary'>

const I16_BYTE_SIZE = Int16Array.BYTES_PER_ELEMENT
const I32_BYTE_SIZE = Int32Array.BYTES_PER_ELEMENT
const F32_BYTE_SIZE = Float32Array.BYTES_PER_ELEMENT

const I16_MAX_NUMBER = 2 ** 16 / 2 - 1

export default class SpeexPreprocessor {
  private readonly speexModule: Readonly<SpeexModule>
  readonly frameSize: number
  readonly samplingRate: number

  private readonly state: SpeexPreprocessState
  private processBuffPtr: I16Ptr
  private processI16Buff: Int16Array

  private ctlBuffPtr?: I32Ptr | F32Ptr

  constructor(
    speexModule: Readonly<SpeexModule>,
    frameSize: number,
    samplingRate: number
  ) {
    this.speexModule = speexModule
    this.frameSize = frameSize
    this.samplingRate = samplingRate

    this.state = this.speexModule._speex_preprocess_state_init(
      this.frameSize,
      this.samplingRate
    )
    this.processBuffPtr = this.speexModule._malloc(
      this.frameSize * I16_BYTE_SIZE
    )
    this.processI16Buff = new Int16Array(this.frameSize)

    if (!this.processBuffPtr) {
      this.destroy()
      throw Error('Failed to allocate process buffer.')
    }
  }

  private mallocCtlBuffPtr() {
    if (this.ctlBuffPtr !== undefined) return
    this.ctlBuffPtr = this.speexModule._malloc(
      4 /** I32_BYTE_SIZE && F32_BYTE_SIZE */
    )

    if (!this.ctlBuffPtr) {
      throw Error('Failed to allocate ctl buffer.')
    }
  }

  private ctl(req: SpeexPreprocessCtlRequest, output?: unknown) {
    const res = this.speexModule._speex_preprocess_ctl(this.state, req, output)
    if (res === -1) {
      throw new Error(`Unknown request: ${req}`)
    }
  }

  private ctlGetI32(req: SpeexPreprocessCtlRequest) {
    this.mallocCtlBuffPtr()

    const ctlBuffIndex = this.ctlBuffPtr! / I32_BYTE_SIZE

    this.ctl(req, this.ctlBuffPtr!)
    return this.speexModule.HEAP32[ctlBuffIndex]!
  }
  private ctlSetI32(req: SpeexPreprocessCtlRequest, value: number) {
    this.mallocCtlBuffPtr()

    const ctlBuffIndex = this.ctlBuffPtr! / I32_BYTE_SIZE
    this.speexModule.HEAP32[ctlBuffIndex] = value

    this.ctl(req, this.ctlBuffPtr!)
  }

  private ctlGetBool(req: SpeexPreprocessCtlRequest) {
    return this.ctlGetI32(req) === 1
  }
  private ctlSetBool(req: SpeexPreprocessCtlRequest, value: boolean) {
    this.ctlSetI32(req, value ? 1 : 0)
  }

  private ctlGetF32(req: SpeexPreprocessCtlRequest) {
    this.mallocCtlBuffPtr()

    const ctlBuffIndex = this.ctlBuffPtr! / F32_BYTE_SIZE

    this.ctl(req, this.ctlBuffPtr!)
    return this.speexModule.HEAPF32[ctlBuffIndex]!
  }
  private ctlSetF32(req: SpeexPreprocessCtlRequest, value: number) {
    this.mallocCtlBuffPtr()

    const ctlBuffIndex = this.ctlBuffPtr! / F32_BYTE_SIZE
    this.speexModule.HEAPF32[ctlBuffIndex] = value

    this.ctl(req, this.ctlBuffPtr!)
  }

  private ctlGetI32Array(req: SpeexPreprocessCtlRequest, size: number) {
    const buffPtr = this.speexModule._malloc(size * I32_BYTE_SIZE)
    const buffIndex = buffPtr / I32_BYTE_SIZE

    this.ctl(req, buffPtr)

    const result = new Int32Array(size)
    const res = this.speexModule.HEAP32.subarray(buffIndex, buffIndex + size)
    result.set(res)

    this.speexModule._free(buffPtr)

    return result
  }

  get denoise() {
    return this.ctlGetBool(SpeexPreprocessCtlRequest.GET_DENOISE)
  }
  set denoise(value: boolean) {
    this.ctlSetBool(SpeexPreprocessCtlRequest.SET_DENOISE, value)
  }

  get agc() {
    return this.ctlGetBool(SpeexPreprocessCtlRequest.GET_AGC)
  }
  set agc(value: boolean) {
    this.ctlSetBool(SpeexPreprocessCtlRequest.SET_AGC, value)
  }

  get vad() {
    return this.ctlGetBool(SpeexPreprocessCtlRequest.GET_VAD)
  }
  set vad(value: boolean) {
    this.ctlSetBool(SpeexPreprocessCtlRequest.SET_VAD, value)
  }

  get agcLevel() {
    return this.ctlGetF32(SpeexPreprocessCtlRequest.GET_AGC_LEVEL)
  }
  set agcLevel(value: number) {
    this.ctlSetF32(SpeexPreprocessCtlRequest.SET_AGC_LEVEL, value)
  }

  get probStart() {
    return this.ctlGetI32(SpeexPreprocessCtlRequest.GET_PROB_START)
  }
  set probStart(value: number) {
    this.ctlSetI32(SpeexPreprocessCtlRequest.SET_PROB_START, value)
  }

  get probContinue() {
    return this.ctlGetI32(SpeexPreprocessCtlRequest.GET_PROB_CONTINUE)
  }
  set probContinue(value: number) {
    this.ctlSetI32(SpeexPreprocessCtlRequest.SET_PROB_CONTINUE, value)
  }

  get noiseSuppress() {
    return this.ctlGetI32(SpeexPreprocessCtlRequest.GET_NOISE_SUPPRESS)
  }
  set noiseSuppress(value: number) {
    this.ctlSetI32(SpeexPreprocessCtlRequest.SET_NOISE_SUPPRESS, value)
  }

  get echoSuppress() {
    return this.ctlGetI32(SpeexPreprocessCtlRequest.GET_ECHO_SUPPRESS)
  }
  set echoSuppress(value: number) {
    this.ctlSetI32(SpeexPreprocessCtlRequest.SET_ECHO_SUPPRESS, value)
  }

  get echoSuppressActive() {
    return this.ctlGetI32(SpeexPreprocessCtlRequest.GET_ECHO_SUPPRESS_ACTIVE)
  }
  set echoSuppressActive(value: number) {
    this.ctlSetI32(SpeexPreprocessCtlRequest.SET_ECHO_SUPPRESS_ACTIVE, value)
  }

  get agcIncrement() {
    return this.ctlGetI32(SpeexPreprocessCtlRequest.GET_AGC_INCREMENT)
  }
  set agcIncrement(value: number) {
    this.ctlSetI32(SpeexPreprocessCtlRequest.SET_AGC_INCREMENT, value)
  }

  get agcDecrement() {
    return this.ctlGetI32(SpeexPreprocessCtlRequest.GET_AGC_DECREMENT)
  }
  set agcDecrement(value: number) {
    this.ctlSetI32(SpeexPreprocessCtlRequest.SET_AGC_DECREMENT, value)
  }

  get agcMaxGain() {
    return this.ctlGetI32(SpeexPreprocessCtlRequest.GET_AGC_MAX_GAIN)
  }
  set agcMaxGain(value: number) {
    this.ctlSetI32(SpeexPreprocessCtlRequest.SET_AGC_MAX_GAIN, value)
  }

  get agcLoudness() {
    return this.ctlGetI32(SpeexPreprocessCtlRequest.GET_AGC_LOUDNESS)
  }

  get agcGain() {
    return this.ctlGetI32(SpeexPreprocessCtlRequest.GET_AGC_GAIN)
  }

  get psdSize() {
    return this.ctlGetI32(SpeexPreprocessCtlRequest.GET_PSD_SIZE)
  }

  get psd() {
    return this.ctlGetI32Array(SpeexPreprocessCtlRequest.GET_PSD, this.psdSize)
  }

  get noisePsdSize() {
    return this.ctlGetI32(SpeexPreprocessCtlRequest.GET_NOISE_PSD_SIZE)
  }

  get noisePsd() {
    return this.ctlGetI32Array(
      SpeexPreprocessCtlRequest.GET_NOISE_PSD,
      this.noisePsdSize
    )
  }

  get prob() {
    return this.ctlGetI32(SpeexPreprocessCtlRequest.GET_PROB)
  }

  get agcTarget() {
    return this.ctlGetI32(SpeexPreprocessCtlRequest.GET_AGC_TARGET)
  }
  set agcTarget(value: number) {
    this.ctlSetI32(SpeexPreprocessCtlRequest.SET_AGC_TARGET, value)
  }

  private assertFrameSize(frame: ArrayLike<number>) {
    if (frame.length !== this.frameSize) {
      throw new Error(
        `Frame size differs. Expected: ${this.frameSize}. Actual: ${frame.length}.`
      )
    }
  }

  processInt16(frame: Int16Array) {
    this.assertFrameSize(frame)

    const processBuffIndex = this.processBuffPtr / I16_BYTE_SIZE
    this.speexModule.HEAP16.set(frame, processBuffIndex)

    const vad = this.speexModule._speex_preprocess_run(
      this.state,
      this.processBuffPtr
    )
    const processedBuff = this.speexModule.HEAP16.subarray(
      processBuffIndex,
      processBuffIndex + this.frameSize
    )
    frame.set(processedBuff)

    return vad === 1
  }

  process(frame: Float32Array) {
    this.assertFrameSize(frame)

    for (let i = 0; i < frame.length; i++) {
      this.processI16Buff[i] = frame[i]! * I16_MAX_NUMBER
    }

    const vad = this.processInt16(this.processI16Buff)

    for (let i = 0; i < frame.length; i++) {
      frame[i] = this.processI16Buff[i]! / I16_MAX_NUMBER
    }

    return vad
  }

  destroy() {
    this.speexModule._free(this.processBuffPtr)
    if (this.ctlBuffPtr !== undefined) {
      this.speexModule._free(this.ctlBuffPtr)
    }
  }
}
