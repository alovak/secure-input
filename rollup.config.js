import pkg from './package.json';

export default [
  {
    input: 'src/outer/main.js',
    output: [
      { file: pkg.main, format: 'iife', name: 'PowerPayments' },
      { file: pkg.module, format: 'cjs' }
    ]
  },
  {
    input: 'src/inner/main.js',
    output: {
      globals: {
        window: 'window'
      },
      external: [ 'window' ],
      file: 'dist/inner.js',
      format: 'iife',
      name: 'PowerPayments'
    }
  },
  {
    input: 'src/test/main.js',
    output: {
      globals: {
        window: 'window'
      },
      external: [ 'window' ],
      file: 'dist/test.js',
      format: 'iife'
    }
  }
];
