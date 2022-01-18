import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  target: 'es2019',
  platform: 'browser',
  sourcemap: true,
  format: ['esm', 'cjs'],
  dts: true
})
