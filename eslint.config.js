const js = require('@eslint/js');
const globals = require('globals');
const importPlugin = require('eslint-plugin-import');
const prettier = require('eslint-config-prettier');

module.exports = [
  {
    ignores: ['node_modules/**', 'coverage/**', 'dist/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node, ...globals.jest }
    },
    plugins: { import: importPlugin },
    rules: {
      'no-console': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
      'no-underscore-dangle': ['error', { allow: ['_id'] }],
      'comma-dangle': ['error', 'never'],
      'prefer-const': 'error',
      eqeqeq: ['error', 'smart'],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: ['**/__tests__/**', 'eslint.config.js', 'jest.config.js', 'babel.config.js']
        }
      ]
    }
  },
  {
    files: ['__tests__/**/*.js'],
    languageOptions: { sourceType: 'module' }
  },
  prettier
];
