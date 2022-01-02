const { build } = require('esbuild')

build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/hive-nodes-checker.min.js',
  bundle: true,
  minify: true,
  // sourcemap: true,
  format: 'esm',
  platform: 'browser',
  target: ['esnext']
})