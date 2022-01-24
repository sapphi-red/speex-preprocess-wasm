export type I16Ptr = number
export type I32Ptr = number
export type F32Ptr = number
export type SpeexPreprocessState = number
export type SpeexPreprocessCtlRequest = number

export interface SpeexModule extends EmscriptenModule {
  /**
   * Creates a new preprocessing state. You MUST create one state per channel processed.
   * @param frame_size Number of samples to process at one time (should correspond to 10-20 ms). Must be
   * the same value as that used for the echo canceller for residual echo cancellation to work.
   * @param sampling_rate Sampling rate used for the input.
   * @return Newly created preprocessor state
   */
  _speex_preprocess_state_init(
    frame_size: number,
    sampling_rate: number
  ): SpeexPreprocessState
  /**
   * Destroys a preprocessor state
   * @param st Preprocessor state to destroy
   */
  _speex_preprocess_state_destroy(state: SpeexPreprocessState): void
  /**
   * Preprocess a frame
   * @param st Preprocessor state
   * @param x Audio sample vector (in and out). Must be same size as specified in speex_preprocess_state_init().
   * @return Bool value for voice activity (1 for speech, 0 for noise/silence), ONLY if VAD turned on.
   */
  _speex_preprocess_run(state: SpeexPreprocessState, x: I16Ptr): 1 | 0
  /**
   * Used like the ioctl function to control the preprocessor parameters
   * @param st Preprocessor state
   * @param request ioctl-type request (one of the SPEEX_PREPROCESS_* macros)
   * @param ptr Data exchanged to-from function
   * @return 0 if no error, -1 if request in unknown
   */
  _speex_preprocess_ctl(
    state: SpeexPreprocessState,
    request: SpeexPreprocessCtlRequest,
    void_: unknown
  ): -1 | 0
}

declare const loadModule: EmscriptenModuleFactory<SpeexModule>

export default loadModule
