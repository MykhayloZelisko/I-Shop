// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const stylisticTs = require('@stylistic/eslint-plugin-ts');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
const prettierConfig = require('eslint-config-prettier')

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      eslintPluginPrettierRecommended,
    ],
    plugins: {
      '@typescript-eslint/eslint-plugin': typescriptEslintPlugin,
      '@stylistic/ts': stylisticTs,
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      "@angular-eslint/sort-lifecycle-methods": [
        "error",
      ],
      '@typescript-eslint/explicit-member-accessibility': 'error',
      '@typescript-eslint/no-duplicate-enum-values': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-mixed-enums': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
        {
          selector: 'function',
          format: ['camelCase'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
      '@stylistic/ts/comma-dangle': ['error', {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "always-multiline",
        "importAttributes": "never",
        "dynamicImports": "never",
        "enums": "always-multiline",
      }],
      '@stylistic/ts/comma-spacing': 'error',
      '@stylistic/ts/no-extra-semi': 'error',
      '@typescript-eslint/no-loop-func': 'error',
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignore: [-1, 0, 1, 2, 3, 8, 32, 1024, 100, 6, 5, 4, 500, 4000],
        },
      ],
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          functions: true,
          classes: true,
          variables: true,
          allowNamedExports: false,
        },
      ],
      '@typescript-eslint/no-useless-constructor': 'error',
      "@typescript-eslint/no-non-null-assertion": "error",
      '@stylistic/ts/quotes': [
        'error',
        'single',
        { allowTemplateLiterals: true },
      ],
      '@typescript-eslint/no-empty-function': [
        'error',
        {
          "allow": ["arrowFunctions"],
        }
      ],
      '@stylistic/ts/func-call-spacing': 'error',
      '@stylistic/ts/keyword-spacing': 'error',
      '@stylistic/ts/lines-between-class-members': [
        'error',
        'always',
        { exceptAfterOverload: false },
      ],
      '@stylistic/ts/space-before-blocks': 'error',
      '@stylistic/ts/semi': 'error',
      '@stylistic/ts/space-before-function-paren': [
        'error',
        { anonymous: 'always', named: 'never', asyncArrow: 'always' },
      ],
      '@stylistic/ts/space-infix-ops': ['error', { int32Hint: false }],
      '@stylistic/ts/object-curly-spacing': ['error', 'always'],
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'lf',
          trailingComma: 'all',
        }
      ],
      'import/extensions': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 'off',
      'class-methods-use-this': 'off',
      'no-var': 'error',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-duplicate-case': 'error',
      'prefer-const': 'error',
      curly: 'error',
      eqeqeq: ['error', 'smart'],
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      eslintPluginPrettierRecommended,
    ],
    rules: {
      'prettier/prettier': ['warn'],
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/template/mouse-events-have-key-events': 'off',

    },
  },
);
