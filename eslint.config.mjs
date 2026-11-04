import { defineConfig, globalIgnores } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import tseslint from 'typescript-eslint'
import security from 'eslint-plugin-security'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default defineConfig([
  globalIgnores([
    // Same as the former .eslintrc.js ignorePatterns (gitignore-style, any depth)
    '**/eslint.config.mjs',
    '**/next.config.js',
    '**/next-env.d.ts',
    '**/out/**',
    '**/examples/**',
    // ESLint 8 skipped dot-directories, so .github/scripts was never linted
    '.github/**'
  ]),
  ...nextCoreWebVitals,
  // After Next so the TypeScript parser applies to every file, as before
  ...tseslint.configs.recommended,
  {
    name: 'safe-docs/type-info',
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  security.configs.recommended,
  // Turns max-len off, so the repo rules must follow it
  prettierRecommended,
  {
    name: 'safe-docs/rules',
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }
      ],
      'multiline-ternary': 'off',
      'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
      'max-len': [
        'error',
        {
          code: 100,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreUrls: true
        }
      ],
      // React Compiler rules from react-hooks 7, off until a follow-up ticket
      'react-hooks/config': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/gating': 'off',
      'react-hooks/globals': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/set-state-in-render': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/unsupported-syntax': 'off',
      'react-hooks/use-memo': 'off'
    }
  }
])
