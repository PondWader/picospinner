import eslint from '@eslint/js';
import {configs as tseslintConfigs} from 'typescript-eslint';
import globals from 'globals';

const {configs: eslintConfigs} = eslint;

export default [
  eslintConfigs.recommended,
  ...tseslintConfigs.strict,
  {
    files: ['src/**/*.ts', '**/*.js'],
    rules: {
      'no-control-regex': 'off'
    },
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
];
