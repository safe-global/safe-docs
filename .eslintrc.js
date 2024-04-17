module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:security/recommended-legacy',
    'standard-with-typescript',
    'next/core-web-vitals'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  ignorePatterns: [
    '.eslintrc.js',
    'next.config.js',
    'next-env.d.ts',
    'out',
    'components/ApiReference/ApiReference.tsx'
  ],
  rules: {
    '@typescript-eslint/key-spacing': 0,
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
