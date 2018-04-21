import pkg from './package.json';

export default [
  {
    input: 'src/main.js',
    output: [
      { file: pkg.main, format: 'iife', name: 'PowerPayments' },
      { file: pkg.module, format: 'cjs' }
    ]
  },
  {
    input: 'src/inner/controller.js',
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
    input: 'src/test.js',
    output: {
      globals: {
        window: 'window'
      },
      external: [ 'window' ],
      file: 'dist/conn.js',
      format: 'iife'
    }
  }
];
