export const SpeexPreprocessCtlRequest = {
  /** Set preprocessor denoiser state */
  SET_DENOISE: 0,
  /** Get preprocessor denoiser state */
  GET_DENOISE: 1,

  /** Set preprocessor Automatic Gain Control state */
  SET_AGC: 2,
  /** Get preprocessor Automatic Gain Control state */
  GET_AGC: 3,

  /** Set preprocessor Voice Activity Detection state */
  SET_VAD: 4,
  /** Get preprocessor Voice Activity Detection state */
  GET_VAD: 5,

  /** Set preprocessor Automatic Gain Control level (float) */
  SET_AGC_LEVEL: 6,
  /** Get preprocessor Automatic Gain Control level (float) */
  GET_AGC_LEVEL: 7,

  // NOTE: de-reverberation is currently disabled
  // /** Set preprocessor dereverb state */
  // SET_DEREVERB: 8,
  // /** Get preprocessor dereverb state */
  // GET_DEREVERB: 9,

  // NOTE: de-reverberation is currently disabled
  // /** Set preprocessor dereverb level */
  // SET_DEREVERB_LEVEL: 10,
  // /** Get preprocessor dereverb level */
  // GET_DEREVERB_LEVEL: 11,

  // NOTE: de-reverberation is currently disabled
  // /** Set preprocessor dereverb decay */
  // SET_DEREVERB_DECAY: 12,
  // /** Get preprocessor dereverb decay */
  // GET_DEREVERB_DECAY: 13,

  /** Set probability required for the VAD to go from silence to voice */
  SET_PROB_START: 14,
  /** Get probability required for the VAD to go from silence to voice */
  GET_PROB_START: 15,

  /** Set probability required for the VAD to stay in the voice state (integer percent) */
  SET_PROB_CONTINUE: 16,
  /** Get probability required for the VAD to stay in the voice state (integer percent) */
  GET_PROB_CONTINUE: 17,

  /** Set maximum attenuation of the noise in dB (negative number) */
  SET_NOISE_SUPPRESS: 18,
  /** Get maximum attenuation of the noise in dB (negative number) */
  GET_NOISE_SUPPRESS: 19,

  /** Set maximum attenuation of the residual echo in dB (negative number) */
  SET_ECHO_SUPPRESS: 20,
  /** Get maximum attenuation of the residual echo in dB (negative number) */
  GET_ECHO_SUPPRESS: 21,

  /** Set maximum attenuation of the residual echo in dB when near end is active (negative number) */
  SET_ECHO_SUPPRESS_ACTIVE: 22,
  /** Get maximum attenuation of the residual echo in dB when near end is active (negative number) */
  GET_ECHO_SUPPRESS_ACTIVE: 23,

  // NOTE: needs SpeexEchoState pointer
  // /** Set the corresponding echo canceller state so that residual echo suppression can be performed (NULL for no residual echo suppression) */
  // SET_ECHO_STATE: 24,
  // /** Get the corresponding echo canceller state */
  // GET_ECHO_STATE: 25,

  /** Set maximal gain increase in dB/second (int32) */
  SET_AGC_INCREMENT: 26,

  /** Get maximal gain increase in dB/second (int32) */
  GET_AGC_INCREMENT: 27,

  /** Set maximal gain decrease in dB/second (int32) */
  SET_AGC_DECREMENT: 28,

  /** Get maximal gain decrease in dB/second (int32) */
  GET_AGC_DECREMENT: 29,

  /** Set maximal gain in dB (int32) */
  SET_AGC_MAX_GAIN: 30,

  /** Get maximal gain in dB (int32) */
  GET_AGC_MAX_GAIN: 31,

  /*  Can't set loudness */
  /** Get loudness */
  GET_AGC_LOUDNESS: 33,

  /*  Can't set gain */
  /** Get current gain (int32 percent) */
  GET_AGC_GAIN: 35,

  /*  Can't set spectrum size */
  /** Get spectrum size for power spectrum (int32) */
  GET_PSD_SIZE: 37,

  /*  Can't set power spectrum */
  /** Get power spectrum (int32[] of squared values) */
  GET_PSD: 39,

  /*  Can't set noise size */
  /** Get spectrum size for noise estimate (int32)  */
  GET_NOISE_PSD_SIZE: 41,

  /*  Can't set noise estimate */
  /** Get noise estimate (int32[] of squared values) */
  GET_NOISE_PSD: 43,

  /* Can't set speech probability */
  /** Get speech probability in last frame (int32).  */
  GET_PROB: 45,

  /** Set preprocessor Automatic Gain Control level (int32) */
  SET_AGC_TARGET: 46,
  /** Get preprocessor Automatic Gain Control level (int32) */
  GET_AGC_TARGET: 47
} as const

export type SpeexPreprocessCtlRequest =
  (typeof SpeexPreprocessCtlRequest)[keyof typeof SpeexPreprocessCtlRequest]
