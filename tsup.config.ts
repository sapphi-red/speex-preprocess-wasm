import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  target: 'es2019',
  esbuildOptions(options) {
    options.supported ??= {}
    options.supported['import-meta'] = true
  },
  platform: 'browser',
  sourcemap: true,
  format: ['esm', 'cjs'],
  dts: true,
  shims: true
})
