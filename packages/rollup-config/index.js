const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');
const copy = require('rollup-plugin-copy');

/**
 * Create a base rollup config
 * @param {import('rollup').RollupOptions} options
 * @returns {import('rollup').RollupOptions}
 */
function createConfig(options) {
  const production = process.env.NODE_ENV === 'production';

  return {
    input: options.input,
    output: {
      file: options.output,
      format: 'iife',
      sourcemap: !production,
      ...options.outputOptions,
    },
    plugins: [
      resolve({ browser: true }),
      commonjs(),
      typescript({
        tsconfig: options.tsconfig || './tsconfig.json',
      }),
      production && terser(),
      options.copy &&
        copy({
          targets: options.copy,
        }),
      ...(options.plugins || []),
    ],
  };
}

module.exports = {
  createConfig,
};
