module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:security/recommended-legacy',
    'next/core-web-vitals',
    'plugin:prettier/recommended'
  ],
  plugins: ['prettier'],
  parserOptions: {
    project: './tsconfig.json'
  },
  ignorePatterns: [
    '.eslintrc.js',
    'next.config.js',
    'next-env.d.ts',
    'out',
    '**/examples/**'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', {
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_'
    }],
    'multiline-ternary': 0,
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'max-len': [
      2,
      {
        code: 100,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true
      }
    ]
  }
}
