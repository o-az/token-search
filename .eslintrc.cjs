/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: true,
  },
  env: { node: true, browser: true },
  reportUnusedDisableDirectives: true,
  extends: [
    'eslint:recommended',
    'plugin:unicorn/all',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'simple-import-sort', 'unused-imports', 'prettier'],
  settings: {},
  overrides: [],
  rules: {
    'unicorn/prefer-top-level-await': ['off'],
    'no-unused-vars': ['off'],
    'array-element-newline': ['error', 'consistent'],
    'object-curly-spacing': ['error', 'always'],
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    'unicorn/prefer-event-target': ['off'],
    'unicorn/prevent-abbreviations': [
      'error',
      {
        allowList: {
          ProcessEnv: true,
        },
        checkFilenames: false,
      },
    ],
    'prettier/prettier': [
      'warn',
      {},
      {
        usePrettierrc: true,
        fileInfoOptions: {
          withNodeModules: true,
        },
      },
    ],
    'no-mixed-operators': ['off'],
    'no-multiple-empty-lines': ['off'],
    'no-unexpected-multiline': ['off'],
    'sort-imports': ['warn', { ignoreDeclarationSort: true }],
    'no-duplicate-imports': ['warn', { includeExports: true }],
    '@typescript-eslint/ban-ts-comment': ['off'],
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: false,
      },
    ],
    '@typescript-eslint/ban-types': [
      'warn',
      {
        types: {
          String: {
            message: 'Use string instead',
            fixWith: 'string',
          },

          '{}': {
            message: 'Use object instead',
            fixWith: 'object',
          },
        },
      },
    ],
  },
};
