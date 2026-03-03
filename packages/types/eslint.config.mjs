import base from '@vesper/eslint-config/base';
import { defineConfig } from 'typescript-eslint';

export default defineConfig(
  ...base,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);