const { createConfig } = require('@repo/rollup-config');

module.exports = [
  createConfig({
    input: 'src/background.ts',
    output: 'dist/background.js',
    tsconfig: './tsconfig.extension.json',
    copy: [
      { src: 'src/manifest.json', dest: 'dist' },
      { src: 'src/assets', dest: 'dist' },
    ],
  }),
  createConfig({
    input: 'src/content-script.ts',
    output: 'dist/content-script.js',
    tsconfig: './tsconfig.extension.json',
  }),
];
