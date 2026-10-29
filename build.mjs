import { build } from 'esbuild'
import { rmSync } from 'fs'

rmSync('dist', { recursive: true, force: true })

await build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  format: 'esm',
  target: 'node22',
  platform: 'neutral',
  minify: true,
})