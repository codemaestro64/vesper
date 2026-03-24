import nextPlugin from '@next/eslint-plugin-next';
import base from '@vesper/eslint-config/base';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...base,
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // 1. Keep 'function' for top-level, but allow arrow functions for
      // internal closures like .map(() => ...) or event handlers.
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    },
  },
  {
    // 2. Disable return type requirements ONLY for React Component files
    // This allows you to skip ": JSX.Element" while keeping it for logic.
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
