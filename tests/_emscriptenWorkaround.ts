// See https://github.com/emscripten-core/emscripten/issues/11792#issuecomment-877120580

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { dirname } from 'path'
globalThis.__dirname = dirname(import.meta.url)

import { createRequire } from 'module'
globalThis.require = createRequire(import.meta.url)
