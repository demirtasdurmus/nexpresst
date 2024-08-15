import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    ignores: ['node_modules/*', 'dist/*', 'package-lock.json'],
  },
  {
    languageOptions: { globals: globals.node },
    rules: {},
  },
];
