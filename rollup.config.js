import peerDepsExternalPlugin from 'rollup-plugin-peer-deps-external'
import postcssPlugin from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import typescriptPlugin from 'rollup-plugin-typescript2'

import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternalPlugin(),
    typescriptPlugin(),
    terser(),
    postcssPlugin(),
  ],
}
