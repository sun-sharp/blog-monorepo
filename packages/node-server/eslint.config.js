const path = require('path');
const globals = require('globals');
const parser = require('@typescript-eslint/parser');
const tseslint = require('@typescript-eslint/eslint-plugin');
const prettier = require('eslint-plugin-prettier');
const eslintConfigPrettier = require('eslint-config-prettier');

const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');

module.exports = [
  {
    ignores: ['dist/', 'node_modules/', '.eslintrc.js', 'coverage/'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: tsconfigPath,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': 'error',
    },
  },
  eslintConfigPrettier,
];
