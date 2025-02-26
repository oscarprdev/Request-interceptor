const { createConfig } = require('@repo/rollup-config');
const path = require('path');

module.exports = [
  // Background script
  createConfig({
    input: 'src/service-worker/background.ts',
    output: 'dist/background.js',
    tsconfig: './tsconfig.json',
    copy: [
      { src: 'src/manifest.json', dest: 'dist' },
      { src: 'src/icons', dest: 'dist/icons' },
    ],
  }),

  // Content script
  createConfig({
    input: 'src/content-script.js',
    output: 'dist/content-script.js',
    tsconfig: './tsconfig.json',
  }),

  // Page scripts
  createConfig({
    input: 'src/page-scripts/utils.js',
    output: 'dist/page-scripts/utils.js',
    tsconfig: './tsconfig.json',
    outputOptions: {
      format: 'esm',
    },
  }),
  createConfig({
    input: 'src/page-scripts/fetch.js',
    output: 'dist/page-scripts/fetch.js',
    tsconfig: './tsconfig.json',
    outputOptions: {
      format: 'esm',
    },
  }),
  createConfig({
    input: 'src/page-scripts/index.js',
    output: 'dist/page-scripts/index.js',
    tsconfig: './tsconfig.json',
    outputOptions: {
      format: 'esm',
    },
  }),
];
