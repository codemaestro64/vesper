import base from "@vesper/eslint-config/base";
import tseslint from "typescript-eslint";

export default tseslint.config(...base, {
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },

  rules: {},
});
