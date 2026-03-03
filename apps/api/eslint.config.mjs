import nest from '@vesper/eslint-config/nest';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...nest,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);