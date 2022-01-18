import fs from 'node:fs/promises'
import { URL } from 'node:url'

const src = new URL('../wasm-out/speex.wasm', import.meta.url)
const dest = new URL('../dist/speex.wasm', import.meta.url)

await fs.copyFile(src, dest)
