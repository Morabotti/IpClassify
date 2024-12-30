import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

import pluginReact from 'eslint-plugin-react';
import pluginRefresh from 'eslint-plugin-react-refresh';
import pluginHooks from 'eslint-plugin-react-hooks';
import pluginReactCompiler from 'eslint-plugin-react-compiler';
import pluginStylistic from '@stylistic/eslint-plugin';

export default [
  {
    ignores: ['build', 'postcss.config.js', 'tailwind.config.js']
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,jsx,tsx}'],
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,jsx,tsx}'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      globals: {
        ...globals.serviceworker,
        ...globals.browser
      }
    }
  },
  pluginJs.configs.recommended,
  pluginRefresh.configs.vite,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  ...tseslint.configs.recommended,
  {
    plugins: {
      'react-hooks': pluginHooks,
      'react-compiler': pluginReactCompiler
    },
    rules: {
      ...pluginHooks.configs.recommended.rules,
      'react/prop-types': 0,
      'react/no-children-prop': 0,
      'react-compiler/react-compiler': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', {
        vars: 'all',
        args: 'after-used',
        argsIgnorePattern: '^_|',
        caughtErrors: 'none'
      }]
    }
  },
  pluginStylistic.configs['disable-legacy'],
  pluginStylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    commaDangle: 'never',
    arrowParens: false,
    jsxQuotes: 'single',
    jsx: true
  }),
  {
    rules: {
      '@stylistic/jsx-quotes': [1, 'prefer-single'],
      '@stylistic/multiline-ternary': 0,
      '@stylistic/arrow-parens': 0,
      '@stylistic/jsx-one-expression-per-line': [1, { allow: 'single-line' }],
      '@stylistic/quote-props': ['error', 'as-needed']
    }
  }
];
