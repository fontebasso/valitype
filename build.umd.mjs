import { build } from 'esbuild'

await build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/valitype.umd.js',
  bundle: true,
  format: 'iife',
  globalName: 'Valitype',
  target: ['es2017'],
  platform: 'browser',
  sourcemap: false,
  minify: true
})
