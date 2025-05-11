import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  target: 'node18',
  format: ['esm'],
  splitting: false,
  shims: false,
  clean: true,
  dts: {
    entry: 'src/index.ts'
  },
  minify: true,
})
