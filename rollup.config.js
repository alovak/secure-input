import pkg from './package.json';
import replace from 'rollup-plugin-replace';
import path from 'path';

function replaceEnvFile(importee, importer) {
  if (importee.match(/ENVIRONMENT/)) {
    let newImportee = importee.replace('ENVIRONMENT', process.env.ENV);
    let newPath = path.resolve( path.dirname( importer ), `${newImportee}.js` );

    console.log(newPath);

    return newPath;
  }
}

export default [
  {
    input: 'src/outer/main.js',
    plugins: [ { resolveId: replaceEnvFile } ],
    output: [
      { file: pkg.main, format: 'iife', name: 'PowerPayments' },
      { file: pkg.module, format: 'cjs' }
    ]
  },
  {
    input: 'src/inner/main.js',
    plugins: [ { resolveId: replaceEnvFile } ],
    output: {
      external: [ 'window' ],
      file: 'dist/inner.js',
      format: 'iife',
    }
  },
  {
    input: 'src/controller/inner.js',
    plugins: [ { resolveId: replaceEnvFile } ],
    output: {
      file: 'dist/controller.js',
      format: 'iife'
    }
  },
  {
    input: 'src/test/main.js',
    plugins: [ { resolveId: replaceEnvFile } ],
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
