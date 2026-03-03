const base = require('./base');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  ...base,
  {
    rules: {
      // nestjs-specific overrides
    }
  }
);