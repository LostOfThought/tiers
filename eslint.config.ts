/* eslint-disable code-complete/no-late-variable-usage -- Config file */
// eslint-disable jsdoc/no-missing-syntax, jsdoc/require-file-overview -- Know config file
import brettz9Plugin from '@brettz9/eslint-plugin';
import eslintCommentsPlugin from '@eslint-community/eslint-plugin-eslint-comments';
import properArrowsPlugin from '@getify/eslint-plugin-proper-arrows';
import stylistic from '@stylistic/eslint-plugin';
import arrayFuncPlugin from 'eslint-plugin-array-func';
import codeCompletePlugin from 'eslint-plugin-code-complete';
import deMorganPlugin from 'eslint-plugin-de-morgan';
import dependPlugin from 'eslint-plugin-depend';
import etcPlugin from 'eslint-plugin-etc';
import functionalPlugin from 'eslint-plugin-functional';
import importNewlinesPlugin from 'eslint-plugin-import-newlines';
import importXPlugin from 'eslint-plugin-import-x';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import miscPlugin from 'eslint-plugin-misc';
import nPlugin from 'eslint-plugin-n';
import noSecretsPlugin from 'eslint-plugin-no-secrets';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import preferArrowPlugin from 'eslint-plugin-prefer-arrow';
import promisePlugin from 'eslint-plugin-promise';
import regexpPlugin from 'eslint-plugin-regexp';
import securityPlugin from 'eslint-plugin-security';
import securityNodePlugin from 'eslint-plugin-security-node';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import tsdocPlugin from 'eslint-plugin-tsdoc';
import unicornPlugin from 'eslint-plugin-unicorn';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import writeGoodCommentsPlugin from 'eslint-plugin-write-good-comments';
import globalsImport from 'globals';
import tseslint from 'typescript-eslint';

import banTypesInStage from './eslint-custom-rules/ban-types-in-stage';

// IMPORTANT: Remove the following TODOs when completed
// TODO [>=1]: eslint-plugin-es-x
// TODO [>=1]: https://github.com/dustinspecker/awesome-eslint?tab=readme-ov-file#practices-and-specific-es-features
// TODO [>=1]: https://github.com/dustinspecker/awesome-eslint?tab=readme-ov-file#security
// TODO [>=1]: https://github.com/dustinspecker/awesome-eslint?tab=readme-ov-file#style
// TODO [>=1]: https://github.com/dustinspecker/awesome-eslint?tab=readme-ov-file#testing-tools
// TODO [>=1]: https://github.com/dustinspecker/awesome-eslint?tab=readme-ov-file#globals
// TODO [>=1]: https://github.com/dustinspecker/awesome-eslint?tab=readme-ov-file#tools

import type { ESLint } from 'eslint';
import type { ReadonlyDeep } from 'type-fest';
import type {
  ConfigArray,
  InfiniteDepthConfigWithExtends,
} from 'typescript-eslint';

type GlobalsInterface = Readonly<{
  es2025?: Readonly<Record<string, boolean>>;
  node?: Readonly<Record<string, boolean>>;
}>;

// 'etc/no-assign-mutated-array': 'error',
// 'etc/no-commented-out-code': 'error',
// 'etc/no-const-enum': 'error',
// 'etc/no-deprecated': [
//   "error",
//   {
//     "ignored": {
//       "^SomeName$": "name",
//       "node_modules/some-path": "path"
//     }
//   }
// ],
// 'etc/no-enum': 'error',
// 'etc/no-implicit-any-catch': [
//   "error",
//   { "allowExplicitAny": false }
// ],
// 'etc/no-internal': [
//   "error",
//   {
//     "ignored": {
//       "node_modules/some-path": "path",
//       "^SomeName$": "name"
//     }
//   }
// ],
// 'etc/no-misused-generics': 'error',
// "etc/no-t": [
//   "error",
//   { "prefix": "" }
// ],
// 'etc/prefer-interface': 'off', // Heck no
// 'etc/prefer-less-than': 'error',
// 'etc/throw-error': 'error',
// 'etc/underscore-internal': 'error',

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Yes, I know what I'm doing
const asReadOnlyDeep = <T>(object: T): ReadonlyDeep<T> => object as ReadonlyDeep<T>;

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Yes, I know what I'm doing
const asPlugin = (object: unknown): ReadonlyDeep<ESLint.Plugin> => object as ESLint.Plugin;

const globals: Readonly<GlobalsInterface> = globalsImport;

const baseRules = asReadOnlyDeep({

  ...{
    'accessor-pairs': 'error',
    'array-callback-return': ['error', {
      allowImplicit: false,
      checkForEach: true,
    }],
    'block-scoped-var': 'error',
    'camelcase': ['error', { properties: 'always' }],
    'capitalized-comments': ['off', 'always', { ignoreConsecutiveComments: true }],
    'class-methods-use-this': 'off', // Superceded by @typescript-eslint/class-methods-use-this
    'complexity': ['error', 10],
    'consistent-return': 'off', // Superceded by @typescript-eslint/consistent-return
    'consistent-this': ['error', 'self'],
    'curly': ['error', 'all'],
    'default-case': 'error',
    'default-case-last': 'error',
    'default-param-last': 'off', // Superceded by @typescript-eslint/default-param-last
    'dot-notation': 'off', // Superceded by @typescript-eslint/dot-notation
    'eqeqeq': ['error', 'always'],
    'for-direction': 'error',
    'func-name-matching': 'error',
    'func-names': ['error', 'always'],
    'func-style': ['error', 'expression'],
    'grouped-accessor-pairs': ['error', 'getBeforeSet'],
    'guard-for-in': 'error',
    'id-denylist': ['error', 'callback', 'cb', 'data', 'err', 'e', 'temp', 'tmp'],
    'id-length': ['error', {
      exceptions: ['i', 'j', 'k', 'x', 'y', 'z', '_'],
      min: 2,
    }],
    'id-match': ['error', '^[a-zA-Z_$][a-zA-Z0-9_$]*$'],
    'init-declarations': 'off', // Superceded by @typescript-eslint/init-declarations
    'logical-assignment-operators': ['error', 'always'],
    'max-classes-per-file': ['error', 1],
    'max-depth': ['error', 3],
    'max-lines': ['error', {
      max: 300,
      skipBlankLines: true,
      skipComments: true,
    }],
    'max-lines-per-function': ['error', {
      max: 50,
      skipBlankLines: true,
      skipComments: true,
    }],
    'max-nested-callbacks': ['error', 3],
    'max-params': ['off', 4], // Superceded by @typescript-eslint/max-params
    'max-statements': ['error', 15],
    'new-cap': 'error',
    'no-alert': 'error',
    'no-array-constructor': 'off', // Superceded by @typescript-eslint/no-array-constructor
    'no-await-in-loop': 'error',
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-console': 'error',
    'no-constructor-return': 'error',
    'no-continue': 'error',
    'no-div-regex': 'error',
    'no-dupe-class-members': 'off', // Superceded by @typescript-eslint/no-dupe-class-members
    'no-duplicate-imports': 'off', // Superceded by import-x/no-duplicates
    'no-else-return': ['error', { allowElseIf: false }],
    'no-empty': ['error', { allowEmptyCatch: false }],
    'no-empty-function': 'off', // Superceded by @typescript-eslint/no-empty-function
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-implicit-globals': 'error',
    'no-implied-eval': 'off', // Superceded by @typescript-eslint/no-implied-eval
    'no-inline-comments': 'off',
    'no-invalid-this': 'off', // Superceded by @typescript-eslint/no-invalid-this
    'no-iterator': 'error',
    'no-label-var': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'off', // Superceded by @typescript-eslint/no-loop-func
    'no-magic-numbers': 'off', // Superceded by @typescript-eslint/no-magic-numbers
    'no-multi-assign': 'error',
    'no-multi-str': 'error',
    'no-negated-condition': 'error',
    'no-nested-ternary': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-object-constructor': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': ['error', { props: true }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: false }],
    'no-promise-executor-return': 'error',
    'no-proto': 'error',
    'no-redeclare': 'off', // Superceded by @typescript-eslint/no-redeclare
    'no-restricted-exports': ['error', { restrictDefaultExports: { direct: true } }],
    'no-restricted-globals': ['error', 'event', 'fdescribe'],
    'no-restricted-imports': 'off', // Superceded by @typescript-eslint/no-restricted-imports
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'ForOfStatement',
      'WithStatement',
      'LabeledStatement',
    ],
    'no-return-assign': ['error', 'always'],
    'no-return-await': 'off', // Superceded by @typescript-eslint/return-await
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-shadow': 'off', // Superceded by @typescript-eslint/no-shadow
    'no-template-curly-in-string': 'error',
    'no-ternary': 'error',
    // eslint-disable-next-line write-good-comments/write-good-comments -- Name of the rule
    'no-throw-literal': 'off', // Superceded by @typescript-eslint/only-throw-error
    'no-undef-init': 'error',
    'no-undefined': 'error',
    'no-underscore-dangle': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unneeded-ternary': 'error',
    'no-unreachable-loop': 'error',
    'no-unused-expressions': ['off', { // Superceded by @typescript-eslint/no-unused-expressions
      allowShortCircuit: false,
      allowTernary: false,
    }],
    'no-unused-private-class-members': 'error',
    'no-unused-vars': 'off', // Superceded by @typescript-eslint/no-unused-vars
    'no-use-before-define': 'off', // Superceded by @typescript-eslint/no-use-before-define
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'off', // Superceded by @typescript-eslint/no-useless-constructor
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-void': 'error',
    'no-warning-comments': ['off', {
      location: 'anywhere',
      terms: ['todo', 'fixme', 'hack', 'xxx'],
    }],
    'no-with': 'error',
    'object-shorthand': ['error', 'always'],
    'one-var': ['error', 'never'],
    'operator-assignment': ['error', 'never'],
    'prefer-arrow-callback': 'error',
    'prefer-const': ['error', { destructuring: 'all' }],
    'prefer-destructuring': ['off', { // Superceded by @typescript-eslint/prefer-destructuring
      array: true,
      object: true,
    }],
    'prefer-exponentiation-operator': 'error',
    'prefer-named-capture-group': 'error',
    'prefer-numeric-literals': 'error',
    'prefer-object-has-own': 'error',
    'prefer-object-spread': 'error',
    'prefer-promise-reject-errors': 'off', // Superceded by @typescript-eslint/prefer-promise-reject-errors
    'prefer-regex-literals': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'radix': ['error', 'always'],
    'require-atomic-updates': 'error',
    'require-await': 'off', // Superceded by @typescript-eslint/require-await
    'require-unicode-regexp': 'error',
    'sort-keys': ['off', 'asc', { natural: true }], // Depricated by @perfectionist/sort-objects
    'sort-vars': 'error',
    'spaced-comment': ['error', 'always'],
    'strict': ['error', 'never'],
    'symbol-description': 'error',
    'vars-on-top': 'error',
    'yoda': ['error', 'never'],
  } as const,
  '@brettz9/arrow-parens': ['off'], // Superceded by @stylistic/arrow-parens
  '@brettz9/block-scoped-var': ['off'], // Superceded by core eslint
  '@brettz9/no-instanceof-array': ['off'], // Superceded unicorn/no-instanceof-array
  '@brettz9/no-instanceof-wrapper': ['error'],
  '@brettz9/no-literal-call': ['error'],
  '@brettz9/no-this-in-static': ['error'],
  '@brettz9/no-use-ignored-vars': ['error', '^_[a-zA-Z]+$'],
  '@brettz9/no-useless-rest-spread': ['off'], // Superceded by unicorn/no-useless-spread
  '@brettz9/prefer-for-of': ['off'], // Superceded by @typescript-eslint/prefer-for-of
  '@eslint-community/eslint-comments/disable-enable-pair': 'error',
  '@eslint-community/eslint-comments/no-aggregating-enable': 'error',
  '@eslint-community/eslint-comments/no-duplicate-disable': 'error',
  '@eslint-community/eslint-comments/no-restricted-disable': 'error',
  '@eslint-community/eslint-comments/no-unlimited-disable': 'error',
  '@eslint-community/eslint-comments/no-unused-disable': 'error',
  '@eslint-community/eslint-comments/no-unused-enable': 'error',
  '@eslint-community/eslint-comments/no-use': 'off',
  '@eslint-community/eslint-comments/require-description': 'error',
  // '@getify/proper-arrows/params': ['error', { // TypeError: context.getScope is not a function
  //   allowed: ['error', '_'],
  //   count: 3,
  //   length: 0,
  //   trivial: true,
  //   unused: 'all',
  // }],
  '@getify/proper-arrows/name': ['error', { trivial: false }],
  '@getify/proper-arrows/return': ['error', {
    chained: true,
    object: true,
    sequence: true,
    ternary: 0,
    trivial: false,
  }],
  '@getify/proper-arrows/where': 'off', // No restrictions on placement
  // '@getify/proper-arrows/this': ['error', "never"], // TypeError: context.getScope is not a function
  '@stylistic/array-bracket-newline': ['error', 'consistent'],
  '@stylistic/array-bracket-spacing': ['error', 'never'],
  '@stylistic/array-element-newline': ['error', 'consistent'],
  '@stylistic/arrow-parens': ['error', 'always', { requireForBlockBody: true }],
  '@stylistic/arrow-spacing': ['error', {
    after: true,
    before: true,
  }],
  '@stylistic/block-spacing': ['error', 'always'],
  '@stylistic/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
  '@stylistic/comma-dangle': ['error', 'always-multiline'],
  '@stylistic/comma-spacing': ['error', {
    after: true,
    before: false,
  }],
  '@stylistic/comma-style': ['error', 'last'],
  '@stylistic/computed-property-spacing': ['error', 'never', { enforceForClassMembers: true }],
  '@stylistic/dot-location': ['error', 'property'],
  '@stylistic/eol-last': 'error',
  '@stylistic/func-call-spacing': ['error', 'never'],
  '@stylistic/function-call-argument-newline': ['error', 'consistent'],
  '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],
  '@stylistic/generator-star-spacing': ['error', {
    after: true,
    before: false,
  }],
  '@stylistic/implicit-arrow-linebreak': ['error', 'beside'],
  '@stylistic/indent': ['error', 2, {
    ArrayExpression: 1,
    CallExpression: { arguments: 1 },
    flatTernaryExpressions: false,
    FunctionDeclaration: {
      body: 1,
      parameters: 1,
    },
    FunctionExpression: {
      body: 1,
      parameters: 1,
    },
    ignoreComments: false,
    ignoredNodes: [
      'TSUnionType',
      'TSIntersectionType',
      'TSTypeParameterInstantiation',
      'FunctionExpression > .params[decorators.length > 0]',
      'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
    ],
    ImportDeclaration: 1,
    MemberExpression: 1,
    ObjectExpression: 1,
    offsetTernaryExpressions: true,
    outerIIFEBody: 1,
    SwitchCase: 1,
    tabLength: 2,
    VariableDeclarator: 1,
  }],
  '@stylistic/indent-binary-ops': ['error', 2],
  '@stylistic/jsx-closing-bracket-location': 'error',
  '@stylistic/jsx-closing-tag-location': 'error',
  '@stylistic/jsx-curly-brace-presence': ['error', { propElementValues: 'always' }],
  '@stylistic/jsx-curly-newline': 'error',
  '@stylistic/jsx-curly-spacing': ['error', 'never'],
  '@stylistic/jsx-equals-spacing': 'error',
  '@stylistic/jsx-first-prop-new-line': 'error',
  '@stylistic/jsx-function-call-newline': ['error', 'multiline'],
  '@stylistic/jsx-indent-props': ['error', 2],
  '@stylistic/jsx-max-props-per-line': ['error', {
    maximum: 1,
    when: 'multiline',
  }],
  '@stylistic/jsx-one-expression-per-line': ['error', { allow: 'single-child' }],
  '@stylistic/jsx-quotes': 'error',
  '@stylistic/jsx-tag-spacing': [
    'error',
    {
      afterOpening: 'never',
      beforeClosing: 'never',
      beforeSelfClosing: 'always',
      closingSlash: 'never',
    },
  ],
  '@stylistic/jsx-wrap-multilines': [
    'error',
    {
      arrow: 'parens-new-line',
      assignment: 'parens-new-line',
      condition: 'parens-new-line',
      declaration: 'parens-new-line',
      logical: 'parens-new-line',
      prop: 'parens-new-line',
      propertyValue: 'parens-new-line',
      return: 'parens-new-line',
    },
  ],
  '@stylistic/key-spacing': ['error', {
    afterColon: true,
    beforeColon: false,
  }],
  '@stylistic/keyword-spacing': ['error', {
    after: true,
    before: true,
  }],
  '@stylistic/line-comment-position': ['off', {
    applyDefaultIgnorePatterns: true,
    ignorePattern: '@ts-expect-error',
    position: 'beside',
  }],
  '@stylistic/linebreak-style': ['error', 'unix'],
  '@stylistic/lines-around-comment': ['off', {
    afterBlockComment: false,
    afterLineComment: false,
    beforeBlockComment: true,
    beforeLineComment: true,
    ignorePattern: '@ts-expect-error',
  }],
  '@stylistic/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
  '@stylistic/max-len': ['error', {
    code: 100,
    ignoreRegExpLiterals: false,
    ignoreStrings: false,
    ignoreTemplateLiterals: false,
    ignoreUrls: false,
    tabWidth: 2,
  }],
  '@stylistic/max-statements-per-line': ['error', { max: 1 }],
  '@stylistic/member-delimiter-style': ['error', {
    multiline: {
      delimiter: 'semi',
      requireLast: true,
    },
    multilineDetection: 'brackets',
    overrides: {
      interface: {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
      },
    },
    singleline: {
      delimiter: 'semi',
    },
  }],
  '@stylistic/multiline-comment-style': ['error', 'separate-lines'],
  '@stylistic/multiline-ternary': ['error', 'always-multiline'],
  '@stylistic/new-parens': 'error',
  '@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
  '@stylistic/no-confusing-arrow': 'error',
  '@stylistic/no-extra-parens': ['error', 'all'],
  '@stylistic/no-extra-semi': 'error',
  '@stylistic/no-floating-decimal': 'error',
  '@stylistic/no-mixed-operators': ['error', {
    allowSamePrecedence: true,
    groups: [
      ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
      ['&&', '||'],
      ['in', 'instanceof'],
    ],
  }],
  '@stylistic/no-mixed-spaces-and-tabs': 'error',
  '@stylistic/no-multi-spaces': 'error',
  '@stylistic/no-multiple-empty-lines': ['error', {
    max: 1,
    maxBOF: 0,
    maxEOF: 0,
  }],
  '@stylistic/no-tabs': 'error',
  '@stylistic/no-trailing-spaces': 'error',
  '@stylistic/no-whitespace-before-property': 'error',
  '@stylistic/nonblock-statement-body-position': ['error', 'beside'],
  '@stylistic/object-curly-newline': ['error', {
    consistent: true,
    multiline: true,
  }],
  '@stylistic/object-curly-spacing': ['error', 'always'],
  '@stylistic/object-property-newline': ['error', {
    allowAllPropertiesOnSameLine: false,
  }],
  '@stylistic/one-var-declaration-per-line': ['error', 'always'],
  '@stylistic/operator-linebreak': ['error', 'before'],
  '@stylistic/padded-blocks': ['error', {
    blocks: 'never',
    classes: 'never',
    switches: 'never',
  }],
  '@stylistic/padding-line-between-statements': [
    'error',
    {
      blankLine: 'always',
      next: 'return',
      prev: '*',
    },
    {
      blankLine: 'always',
      next: '*',
      prev: ['const', 'let', 'var'],
    },
    {
      blankLine: 'any',
      next: ['const', 'let', 'var'],
      prev: ['const', 'let', 'var'],
    },
  ],
  '@stylistic/quote-props': ['error', 'consistent-as-needed'],
  '@stylistic/quotes': ['error', 'single', {
    allowTemplateLiterals: true,
    avoidEscape: false,
  }],
  '@stylistic/rest-spread-spacing': ['error', 'never'],
  '@stylistic/semi': ['error', 'always'],
  '@stylistic/semi-spacing': ['error', {
    after: true,
    before: false,
  }],
  '@stylistic/semi-style': ['error', 'last'],
  '@stylistic/space-before-blocks': ['error', 'always'],
  '@stylistic/space-before-function-paren': ['error', {
    anonymous: 'always',
    asyncArrow: 'always',
    named: 'never',
  }],
  '@stylistic/space-in-parens': ['error', 'never'],
  '@stylistic/space-infix-ops': 'error',
  '@stylistic/space-unary-ops': ['error', {
    nonwords: false,
    words: true,
  }],
  '@stylistic/spaced-comment': ['error', 'always', {
    block: {
      balanced: true,
      exceptions: ['*'],
      markers: ['!'],
    },
    line: {
      exceptions: ['/', '#'],
      markers: ['/'],
    },
  }],
  '@stylistic/switch-colon-spacing': 'error',
  '@stylistic/template-curly-spacing': 'error',
  '@stylistic/template-tag-spacing': ['error', 'never'],
  '@stylistic/type-annotation-spacing': ['error', {}],
  '@stylistic/type-generic-spacing': 'error',
  '@stylistic/type-named-tuple-spacing': 'error',
  '@stylistic/wrap-iife': ['error', 'any', { functionPrototypeMethods: true }],
  '@stylistic/wrap-regex': 'error',
  '@stylistic/yield-star-spacing': ['error', {
    after: true,
    before: false,
  }],
  '@typescript-eslint/adjacent-overload-signatures': 'error',
  '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
  '@typescript-eslint/await-thenable': 'error',
  '@typescript-eslint/ban-ts-comment': ['error', {
    'ts-check': false,
    'ts-expect-error': 'allow-with-description',
    'ts-ignore': false,
    'ts-nocheck': false,
  }],
  '@typescript-eslint/ban-tslint-comment': 'error',
  '@typescript-eslint/class-literal-property-style': ['error', 'fields'],
  '@typescript-eslint/class-methods-use-this': 'error',
  '@typescript-eslint/consistent-generic-constructors': ['error', 'constructor'],
  '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
  '@typescript-eslint/consistent-type-assertions': ['error', {
    assertionStyle: 'as',
    objectLiteralTypeAssertions: 'never',
  }],
  '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
  '@typescript-eslint/consistent-type-exports': 'error',
  '@typescript-eslint/consistent-type-imports': ['error', {
    fixStyle: 'separate-type-imports',
    prefer: 'type-imports',
  }],
  '@typescript-eslint/default-param-last': 'error',
  '@typescript-eslint/dot-notation': 'error',
  '@typescript-eslint/explicit-function-return-type': ['error', {
    allowExpressions: false,
    allowHigherOrderFunctions: false,
    allowTypedFunctionExpressions: false,
  }],
  '@typescript-eslint/explicit-member-accessibility': ['error', {
    accessibility: 'explicit',
  }],
  '@typescript-eslint/explicit-module-boundary-types': 'error',
  '@typescript-eslint/init-declarations': ['error', 'always'],
  '@typescript-eslint/max-params': ['error', { max: 3 }],
  '@typescript-eslint/member-ordering': 'error',
  '@typescript-eslint/method-signature-style': ['error', 'property'],
  '@typescript-eslint/naming-convention': [
    'error',
    {
      format: ['camelCase'],
      selector: 'default',
    },
    {
      format: ['camelCase', 'UPPER_CASE'],
      selector: 'variable',
    },
    {
      format: ['camelCase'],
      leadingUnderscore: 'allow',
      selector: 'parameter',
    },
    {
      format: ['camelCase'],
      leadingUnderscore: 'require',
      modifiers: ['private'],
      selector: 'memberLike',
    },
    {
      format: ['PascalCase'],
      selector: 'typeLike',
    },
    {
      format: ['UPPER_CASE'],
      selector: 'enumMember',
    },
  ],
  '@typescript-eslint/no-array-constructor': 'error',
  '@typescript-eslint/no-array-delete': 'error',
  '@typescript-eslint/no-base-to-string': 'error',
  '@typescript-eslint/no-confusing-non-null-assertion': 'error',
  '@typescript-eslint/no-confusing-void-expression': 'error',
  '@typescript-eslint/no-deprecated': 'error', // Migrated from: 'eslint-plugin-deprecation'
  '@typescript-eslint/no-dupe-class-members': 'error',
  '@typescript-eslint/no-duplicate-enum-values': 'error',
  '@typescript-eslint/no-duplicate-type-constituents': 'error',
  '@typescript-eslint/no-dynamic-delete': 'error',
  '@typescript-eslint/no-empty-function': 'error',
  '@typescript-eslint/no-empty-interface': 'error',
  '@typescript-eslint/no-empty-object-type': 'error',
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-extra-non-null-assertion': 'error',
  '@typescript-eslint/no-extraneous-class': 'error',
  '@typescript-eslint/no-floating-promises': 'error',
  '@typescript-eslint/no-for-in-array': 'error',
  '@typescript-eslint/no-implied-eval': 'error',
  '@typescript-eslint/no-import-type-side-effects': 'error',
  '@typescript-eslint/no-inferrable-types': 'error',
  '@typescript-eslint/no-invalid-this': 'error',
  '@typescript-eslint/no-invalid-void-type': 'error',
  '@typescript-eslint/no-loop-func': 'error',
  '@typescript-eslint/no-loss-of-precision': 'error',
  '@typescript-eslint/no-magic-numbers': ['error', {
    detectObjects: false,
    enforceConst: true,
    ignore: [-1, 0, 1],
  }],
  '@typescript-eslint/no-meaningless-void-operator': 'error',
  '@typescript-eslint/no-misused-new': 'error',
  '@typescript-eslint/no-misused-promises': 'error',
  '@typescript-eslint/no-misused-spread': 'error',
  '@typescript-eslint/no-mixed-enums': 'error',
  '@typescript-eslint/no-namespace': 'error',
  '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
  '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
  '@typescript-eslint/no-non-null-assertion': 'error',
  '@typescript-eslint/no-redeclare': 'error',
  '@typescript-eslint/no-redundant-type-constituents': 'error',
  '@typescript-eslint/no-require-imports': 'error',
  '@typescript-eslint/no-restricted-imports': 'error',
  '@typescript-eslint/no-restricted-types': 'error',
  '@typescript-eslint/no-shadow': 'error',
  '@typescript-eslint/no-this-alias': 'error',
  '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
  '@typescript-eslint/no-unnecessary-condition': 'error',
  '@typescript-eslint/no-unnecessary-parameter-property-assignment': 'error',
  '@typescript-eslint/no-unnecessary-qualifier': 'error',
  '@typescript-eslint/no-unnecessary-template-expression': 'error',
  '@typescript-eslint/no-unnecessary-type-arguments': 'error',
  '@typescript-eslint/no-unnecessary-type-assertion': 'error',
  '@typescript-eslint/no-unnecessary-type-constraint': 'error',
  '@typescript-eslint/no-unnecessary-type-conversion': 'error',
  '@typescript-eslint/no-unnecessary-type-parameters': 'error',
  '@typescript-eslint/no-unsafe-argument': 'error',
  '@typescript-eslint/no-unsafe-assignment': 'error',
  '@typescript-eslint/no-unsafe-call': 'error',
  '@typescript-eslint/no-unsafe-declaration-merging': 'error',
  '@typescript-eslint/no-unsafe-enum-comparison': 'error',
  '@typescript-eslint/no-unsafe-function-type': 'error',
  '@typescript-eslint/no-unsafe-member-access': 'error',
  '@typescript-eslint/no-unsafe-return': 'error',
  '@typescript-eslint/no-unsafe-type-assertion': 'error',
  '@typescript-eslint/no-unsafe-unary-minus': 'error',
  '@typescript-eslint/no-unused-expressions': 'error',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
      ignoreRestSiblings: false,
      varsIgnorePattern: '^_',
    },
  ],
  '@typescript-eslint/no-use-before-define': ['error', {
    classes: true,
    enums: true,
    functions: true,
    typedefs: true,
    variables: true,
  }],
  '@typescript-eslint/no-useless-constructor': 'error',
  '@typescript-eslint/no-useless-empty-export': 'error',
  '@typescript-eslint/no-var-requires': 'error',
  '@typescript-eslint/no-wrapper-object-types': 'error',
  '@typescript-eslint/non-nullable-type-assertion-style': 'error',
  '@typescript-eslint/only-throw-error': 'error',
  '@typescript-eslint/parameter-properties': ['error', {
    prefer: 'parameter-property',
  }],
  '@typescript-eslint/prefer-as-const': 'error',
  '@typescript-eslint/prefer-destructuring': ['error', {
    array: true,
    object: true,
  }],
  '@typescript-eslint/prefer-enum-initializers': 'error',
  '@typescript-eslint/prefer-find': 'error',
  '@typescript-eslint/prefer-for-of': 'error',
  '@typescript-eslint/prefer-function-type': 'error',
  '@typescript-eslint/prefer-includes': 'error',
  '@typescript-eslint/prefer-literal-enum-member': 'error',
  '@typescript-eslint/prefer-namespace-keyword': 'error',
  '@typescript-eslint/prefer-nullish-coalescing': 'error',
  '@typescript-eslint/prefer-optional-chain': 'error',
  '@typescript-eslint/prefer-promise-reject-errors': 'error',
  '@typescript-eslint/prefer-readonly': 'error',
  '@typescript-eslint/prefer-readonly-parameter-types': 'error',
  '@typescript-eslint/prefer-reduce-type-parameter': 'error',
  '@typescript-eslint/prefer-regexp-exec': 'error',
  '@typescript-eslint/prefer-return-this-type': 'error',
  '@typescript-eslint/prefer-string-starts-ends-with': 'error',
  '@typescript-eslint/promise-function-async': 'error',
  '@typescript-eslint/require-array-sort-compare': 'error',
  '@typescript-eslint/require-await': 'error',
  '@typescript-eslint/restrict-plus-operands': 'error',
  '@typescript-eslint/restrict-template-expressions': 'error',
  '@typescript-eslint/return-await': ['error', 'always'],
  '@typescript-eslint/sort-type-constituents': 'error',
  '@typescript-eslint/strict-boolean-expressions': [
    'error',
    {
      allowAny: false,
      allowNullableBoolean: false,
      allowNullableNumber: false,
      allowNullableObject: false,
      allowNullableString: false,
      allowNumber: false,
      allowString: false,
    },
  ],
  '@typescript-eslint/switch-exhaustiveness-check': 'error',
  '@typescript-eslint/triple-slash-reference': 'error',
  '@typescript-eslint/typedef': 'off', // Depricated: --noImplicitAny and --strictPropertyInitialization compiler options
  '@typescript-eslint/unbound-method': 'error',
  '@typescript-eslint/unified-signatures': 'error',
  '@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',
  'array-func/avoid-reverse': 'error',
  'array-func/from-map': 'error',
  'array-func/no-unnecessary-this-arg': 'error',
  'array-func/prefer-array-from': 'error',
  'array-func/prefer-flat': 'error',
  'array-func/prefer-flat-map': 'error',
  'code-complete/enforce-meaningful-names': ['error', {
    allowedNames: ['_'],
    disallowedNames: ['tmp', 'foo', 'bar', 'baz'],
    minLength: 3,
  }],
  'code-complete/low-function-cohesion': ['error', {
    minFunctionLength: 10,
    minSharedVariablePercentage: 30,
  }],
  'code-complete/no-boolean-params': ['error', {
    ignoreDefault: false,
  }],
  'code-complete/no-late-argument-usage': ['error', {
    maxLinesBetweenDeclarationAndUsage: 5,
  }],
  'code-complete/no-late-variable-usage': ['error', {
    maxLinesBetweenDeclarationAndUsage: 5,
  }],
  'code-complete/no-magic-numbers-except-zero-one': 'off', // Superseded by @typescript-eslint/no-magic-numbers
  'de-morgan/no-negated-conjunction': 'error',
  'de-morgan/no-negated-disjunction': 'error',
  'depend/ban-dependencies': ['error', {
    presets: ['native', 'microutilities', 'preferred'],
  }],
  'functional/functional-parameters': ['error', {
    allowArgumentsKeyword: false,
    allowRestParameter: false,
    enforceParameterCount: {
      count: 'atLeastOne',
      ignoreIIFE: false,
    },
  }],
  'functional/immutable-data': ['error', {
    ignoreClasses: false,
    ignoreImmediateMutation: false,
    ignoreNonConstDeclarations: false,
  }],
  'functional/no-classes': 'error',
  'functional/no-conditional-statements': ['error', {
    allowReturningBranches: false,
  }],
  'functional/no-expression-statements': ['error', {
    ignoreCodePattern: [],
    ignoreVoid: false,
  }],
  'functional/no-let': ['error', {
    allowInForLoopInit: false,
    allowInFunctions: false,
    ignoreIdentifierPattern: [],
  }],
  'functional/no-loop-statements': 'error',
  'functional/no-mixed-types': 'error',
  'functional/no-promise-reject': 'error',
  'functional/no-return-void': 'error',
  'functional/no-this-expressions': 'error',
  'functional/no-throw-statements': 'error',
  'functional/no-try-statements': 'error',
  'functional/prefer-immutable-types': ['error', {
    enforcement: 'ReadonlyDeep',
    fixer: {
      ReadonlyDeep: [
        {
          pattern: '^(.+)$',
          replace: 'ReadonlyDeep<$1>',
        },
      ],
    },
    ignoreClasses: false,
    ignoreInferredTypes: false,
    suggestions: {},
  }],
  'functional/prefer-property-signatures': 'error',
  'functional/prefer-readonly-type': 'off', // Depricated: functional/prefer-immutable-types, functional/type-declaration-immutability
  'functional/prefer-tacit': ['error', {
    checkMemberExpressions: true,
  }],
  'functional/readonly-type': 'error',
  'functional/type-declaration-immutability': 'error',
  'import-newlines/enforce': [
    'error',
    {
      'items': 1,
      'max-len': 100,
      'semi': true,
    },
  ],
  'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],
  'import-x/dynamic-import-chunkname': ['off', { // BUG: This feature has a bug
    allowEmpty: false,
    importFunctions: ['import'],
    webpackChunknameFormat: '[a-zA-Z0-9-/_]+',
  }],
  'import-x/export': 'error',
  'import-x/exports-last': 'error',
  'import-x/extensions': ['error', 'never', { json: 'always' }],
  'import-x/first': 'error',
  'import-x/group-exports': 'error',
  'import-x/max-dependencies': ['error', { max: 10 }],
  'import-x/named': 'error',
  'import-x/namespace': 'error',
  'import-x/newline-after-import': 'error',
  'import-x/no-absolute-path': 'error',
  'import-x/no-amd': 'error',
  'import-x/no-anonymous-default-export': 'error',
  'import-x/no-commonjs': 'error',
  'import-x/no-cycle': 'error',
  'import-x/no-default-export': 'error',
  'import-x/no-deprecated': 'error',
  'import-x/no-duplicates': 'off', // I want this on, but it triggers for type imports as well
  'import-x/no-dynamic-require': 'error',
  'import-x/no-empty-named-blocks': 'error',
  'import-x/no-extraneous-dependencies': [
    'error',
    {
      bundledDependencies: true,
      devDependencies: false,
      includeInternal: true,
      includeTypes: true,
      optionalDependencies: false,
      peerDependencies: false,
    },
  ],
  'import-x/no-import-module-exports': 'error',
  'import-x/no-internal-modules': 'error',
  'import-x/no-mutable-exports': 'error',
  'import-x/no-named-as-default': 'error',
  'import-x/no-named-as-default-member': 'error',
  'import-x/no-named-default': 'error',
  'import-x/no-namespace': 'error',
  'import-x/no-nodejs-modules': 'error',
  'import-x/no-relative-packages': 'error',
  'import-x/no-relative-parent-imports': 'error',
  'import-x/no-restricted-paths': 'error',
  'import-x/no-self-import': 'error',
  'import-x/no-unassigned-import': 'error',
  'import-x/no-unresolved': [
    'error',
    {
      amd: true,
      commonjs: true,
      ignore: ['^lua-types/.*', '^typed-factorio/.*'],
    },
  ],
  'import-x/no-unused-modules': 'error',
  'import-x/no-useless-path-segments': 'error',
  'import-x/no-webpack-loader-syntax': 'error',
  'import-x/order': [
    'error',
    {
      'alphabetize': {
        caseInsensitive: false,
        order: 'asc',
        orderImportKind: 'asc',
      },
      'distinctGroup': true,
      'groups': [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
        'object',
        'type',
      ],
      'newlines-between': 'always',
      'pathGroups': [
        {
          group: 'internal',
          pattern: '@/**',
        },
      ],
      // eslint-disable-next-line no-secrets/no-secrets -- Not a secret
      'pathGroupsExcludedImportTypes': ['type'],
      'warnOnUnassignedImports': true,
    },
  ],
  'import-x/prefer-default-export': 'off', // Conflicts with no-default-export
  'jsdoc/check-access': 'error',
  'jsdoc/check-alignment': 'error',
  'jsdoc/check-examples': 'error',
  'jsdoc/check-indentation': 'error',
  'jsdoc/check-line-alignment': 'error',
  'jsdoc/check-param-names': 'error',
  'jsdoc/check-property-names': 'error',
  'jsdoc/check-syntax': 'error',
  'jsdoc/check-tag-names': 'error',
  'jsdoc/check-types': 'error',
  'jsdoc/check-values': 'error',
  'jsdoc/convert-to-jsdoc-comments': 'error',
  'jsdoc/empty-tags': 'error',
  'jsdoc/implements-on-classes': 'error',
  'jsdoc/informative-docs': 'error',
  'jsdoc/match-description': 'error',
  'jsdoc/match-name': 'error',
  'jsdoc/multiline-blocks': 'error',
  'jsdoc/no-bad-blocks': 'error',
  'jsdoc/no-blank-block-descriptions': 'error',
  'jsdoc/no-blank-blocks': 'error',
  'jsdoc/no-defaults': 'error',
  'jsdoc/no-missing-syntax': ['off', { contexts: ['any'] }], // Fix later
  'jsdoc/no-multi-asterisks': 'error',
  'jsdoc/no-restricted-syntax': 'error',
  'jsdoc/no-types': 'error',
  'jsdoc/no-undefined-types': 'error',
  'jsdoc/require-asterisk-prefix': 'error',
  'jsdoc/require-description': 'error',
  'jsdoc/require-description-complete-sentence': 'error',
  'jsdoc/require-example': 'error',
  'jsdoc/require-file-overview': 'off', // Fix later
  'jsdoc/require-hyphen-before-param-description': 'error',
  'jsdoc/require-jsdoc': 'error',
  'jsdoc/require-param': 'error',
  'jsdoc/require-param-description': 'error',
  'jsdoc/require-param-name': 'error',
  'jsdoc/require-param-type': 'off', // TypeScript handles this
  'jsdoc/require-property': 'error',
  'jsdoc/require-property-description': 'error',
  'jsdoc/require-property-name': 'error',
  'jsdoc/require-property-type': 'off', // TypeScript handles this
  'jsdoc/require-returns': 'error',
  'jsdoc/require-returns-check': 'error',
  'jsdoc/require-returns-description': 'error',
  'jsdoc/require-returns-type': 'off', // TypeScript handles this
  'jsdoc/require-template': 'error',
  'jsdoc/require-throws': 'error',
  'jsdoc/require-yields': 'error',
  'jsdoc/require-yields-check': 'error',
  'jsdoc/sort-tags': 'error',
  'jsdoc/tag-lines': ['error', 'never', { startLines: 1 }],
  'jsdoc/text-escaping': ['error', { escapeMarkdown: true }],
  'jsdoc/valid-types': 'error',
  'misc/class-match-filename': 'error',
  'misc/comment-spacing': 'off', // Superceeded by core rule
  'misc/consistent-empty-lines': [
    'off',
    {
      rules: [
        {
          _id: 'import',
          emptyLine: 'always',
          selector: 'ImportDeclaration',
        },
      ],
    },
  ],
  'misc/consistent-enum-members': 'off', // Not using enums
  'misc/consistent-filename': ['error', {
    overrides: [
      {
        _id: 'class',
        format: 'PascalCase',
        match: true,
        selector: 'ClassDeclaration > Identifier.id',
      },
    ],
  }],
  'misc/consistent-import': 'off', // Requires consistent key-value pairs inside enums.
  'misc/consistent-optional-props': [
    'error',
    {
      classes: 'combined',
      interfaces: 'combined',
      overrides: [],
    },
  ],
  'misc/consistent-source-extension': 'off', // Want .ts extensions
  'misc/consistent-symbol-description': 'error',
  'misc/disallow-import': ['off', {
    disallow: [],
  }],
  'misc/export-matching-filename-only': 'error',
  'misc/match-filename': 'off',
  'misc/max-identifier-blocks': 'error',
  'misc/no-at-sign-import': 'off',
  'misc/no-at-sign-internal-import': 'off',
  'misc/no-chain-coalescence-mixture': 'error',
  'misc/no-expression-empty-lines': 'error',
  'misc/no-index-import': 'error',
  'misc/no-internal-modules': 'off',
  'misc/no-language-mixing': 'error',
  'misc/no-negated-conditions': 'off', // Suceeded by 'unicorn/no-negated-condition'
  'misc/no-nodejs-modules': 'off',
  'misc/no-param-reassign': 'off',
  'misc/no-relative-parent-import': 'off',
  'misc/no-restricted-syntax': 'off',
  'misc/no-self-import': 'error',
  'misc/no-shadow': 'off', // Superceded by @typescript-eslint/no-shadow
  'misc/no-sibling-import': 'off',
  'misc/no-underscore-export': 'error',
  'misc/no-unnecessary-as-const': 'error',
  'misc/no-unnecessary-break': 'error',
  'misc/no-unnecessary-initialization': 'error',
  'misc/no-unnecessary-template-literal': 'error',
  'misc/object-format': 'off', // TODO [>=1]: Find a better place for this configuration
  'misc/only-export-name': 'error',
  'misc/prefer-arrow-function-property': 'error',
  'misc/prefer-const-require': 'off', // Using ESM module system
  'misc/prefer-only-export': 'off',
  'misc/require-jsdoc': 'off', // Have a whole plugin for this
  'misc/require-syntax': 'off',
  'misc/restrict-identifier-characters': 'error',
  'misc/sort-array': 'off',
  'misc/sort-call-signature': 'error',
  'misc/sort-class-members': ['off', { // Consider a better implementation approach
    sortingOrder: [
      'static-field',
      'static-method',
      'constructor',
      'field',
      'method',
    ],
  }],
  'misc/sort-construct-signature': 'error',
  'misc/sort-export-specifiers': 'error',
  'misc/sort-keys': 'off', // Depricated by @perfectionist/sort-objects
  'misc/sort-top-comments': 'off',
  'misc/switch-case-spacing': 'error',
  'misc/template-literal-format': 'off',
  'misc/typescript/array-callback-return-type': 'error',
  'misc/typescript/class-methods-use-this': 'off', // Superceded by @typescript-eslint/class-methods-use-this
  'misc/typescript/consistent-array-type-name': 'error',
  'misc/typescript/define-function-in-one-statement': 'error',
  'misc/typescript/exhaustive-switch': 'error', // Superceded by '@typescript-eslint/switch-exhaustiveness-check'
  'misc/typescript/no-boolean-literal-type': 'off',
  'misc/typescript/no-complex-declarator-type': 'error',
  'misc/typescript/no-complex-return-type': 'error',
  'misc/typescript/no-empty-interfaces': 'error',
  'misc/typescript/no-inferrable-types': 'error', // Superceded by @typescript-eslint/no-inferrable-types
  'misc/typescript/no-multi-type-tuples': 'off',
  'misc/typescript/no-never': 'error',
  'misc/typescript/no-restricted-syntax': 'off',
  'misc/typescript/no-unsafe-object-assign': 'off', // Superceded by @typescript-eslint/no-unsafe-assignment
  'misc/typescript/no-unsafe-object-assignment': 'off', // Superceded by @typescript-eslint/no-unsafe-assignment
  'misc/typescript/prefer-array-type-alias': 'off',
  'misc/typescript/prefer-class-method': 'error',
  'misc/typescript/prefer-enum': 'off', // No enums
  'misc/typescript/prefer-readonly-array': 'off',
  'misc/typescript/prefer-readonly-map': 'off',
  'misc/typescript/prefer-readonly-property': 'off',
  'misc/typescript/prefer-readonly-set': 'off',
  'misc/typescript/require-prop-type-annotation': 'error',
  'misc/typescript/require-this-void': 'off', // Superceded by @typescript-eslint/class-methods-use-this
  'misc/wrap': ['off', {
    disableFix: false,
    lint: [],
    plugin: '@typescript-eslint/eslint-plugin',
    rule: 'no-console',
    skip: [],
  }],
  'n/callback-return': 'error',
  'n/exports-style': ['error', 'module.exports'],
  'n/file-extension-in-import': ['error', 'never'],
  'n/global-require': 'error',
  'n/handle-callback-err': 'error',
  'n/no-callback-literal': 'error',
  'n/no-missing-import': 'off', // Redundant with Typescript
  'n/no-missing-require': 'error',
  'n/no-mixed-requires': 'error',
  'n/no-new-require': 'error',
  'n/no-path-concat': 'error',
  'n/no-process-env': 'error',
  'n/no-process-exit': 'error',
  'n/no-restricted-import': 'error',
  'n/no-restricted-require': 'error',
  'n/no-sync': 'error',
  'n/prefer-global/buffer': 'error',
  'n/prefer-global/console': 'error',
  'n/prefer-global/process': 'error',
  'n/prefer-global/text-decoder': 'error',
  'n/prefer-global/text-encoder': 'error',
  'n/prefer-global/url': 'error',
  'n/prefer-global/url-search-params': 'error',
  'n/prefer-promises/dns': 'error',
  'n/prefer-promises/fs': 'error',
  'no-secrets/no-secrets': ['error', {
    additionalRegexes: {},
    tolerance: 4,
  }],
  'perfectionist/sort-array-includes': 'error',
  'perfectionist/sort-classes': 'error',
  'perfectionist/sort-enums': 'error',
  'perfectionist/sort-exports': 'error',
  'perfectionist/sort-imports': 'off', // Let import-x handle this
  'perfectionist/sort-interfaces': 'error',
  'perfectionist/sort-intersection-types': 'off', // Superceded by @typescript-eslint/sort-type-constituents
  'perfectionist/sort-jsx-props': 'error',
  'perfectionist/sort-maps': 'error',
  'perfectionist/sort-named-exports': 'error',
  'perfectionist/sort-named-imports': 'error',
  'perfectionist/sort-object-types': 'error',
  'perfectionist/sort-objects': [
    'error',
    {
      customGroups: {},
      groups: [],
      ignoreCase: false,
      ignorePattern: [],
      newlinesBetween: 'never',
      order: 'asc',
      partitionByComment: true,
      partitionByNewLine: false,
      type: 'natural',
    },
  ],
  'perfectionist/sort-sets': 'error',
  'perfectionist/sort-switch-case': 'error',
  'perfectionist/sort-union-types': 'off', // Superceded by @typescript-eslint/sort-type-constituents
  'perfectionist/sort-variable-declarations': 'error',
  'prefer-arrow/prefer-arrow-functions': ['error', {
    // eslint-disable-next-line unicorn/no-keyword-prefix -- Config option
    classPropertiesAllowed: false,
    disallowPrototype: true,
    singleReturnOnly: false,
  }],
  'promise/always-return': 'error',
  'promise/avoid-new': 'error',
  'promise/catch-or-return': ['error', { allowFinally: false }],
  'promise/no-callback-in-promise': 'error',
  'promise/no-multiple-resolved': 'error',
  'promise/no-native': 'off',
  'promise/no-nesting': 'error',
  'promise/no-new-statics': 'error',
  'promise/no-promise-in-callback': 'error',
  'promise/no-return-in-finally': 'error',
  'promise/no-return-wrap': 'error',
  'promise/param-names': 'error',
  'promise/prefer-await-to-callbacks': 'error',
  'promise/prefer-await-to-then': 'error',
  'promise/prefer-catch': 'error',
  'promise/spec-only': 'error',
  'promise/valid-params': 'error',
  'regexp/confusing-quantifier': 'error',
  'regexp/control-character-escape': 'error',
  'regexp/grapheme-string-literal': 'error',
  'regexp/hexadecimal-escape': 'error',
  'regexp/letter-case': 'error',
  'regexp/match-any': 'error',
  'regexp/negation': 'error',
  'regexp/no-contradiction-with-assertion': 'error',
  'regexp/no-control-character': 'error',
  'regexp/no-dupe-characters-character-class': 'error',
  'regexp/no-dupe-disjunctions': 'error',
  'regexp/no-empty-alternative': 'error',
  'regexp/no-empty-capturing-group': 'error',
  'regexp/no-empty-character-class': 'error',
  'regexp/no-empty-group': 'error',
  'regexp/no-empty-lookarounds-assertion': 'error',
  'regexp/no-empty-string-literal': 'error',
  'regexp/no-escape-backspace': 'error',
  'regexp/no-extra-lookaround-assertions': 'error',
  'regexp/no-invalid-regexp': 'error',
  'regexp/no-invisible-character': 'error',
  'regexp/no-lazy-ends': 'error',
  'regexp/no-legacy-features': 'error',
  'regexp/no-misleading-capturing-group': 'error',
  'regexp/no-misleading-unicode-character': 'error',
  'regexp/no-missing-g-flag': 'error',
  'regexp/no-non-standard-flag': 'error',
  'regexp/no-obscure-range': 'error',
  'regexp/no-octal': 'error',
  'regexp/no-optional-assertion': 'error',
  'regexp/no-potentially-useless-backreference': 'error',
  'regexp/no-standalone-backslash': 'error',
  'regexp/no-super-linear-backtracking': 'error',
  'regexp/no-super-linear-move': 'error',
  'regexp/no-trivially-nested-assertion': 'error',
  'regexp/no-trivially-nested-quantifier': 'error',
  'regexp/no-unused-capturing-group': 'error',
  'regexp/no-useless-assertions': 'error',
  'regexp/no-useless-backreference': 'error',
  'regexp/no-useless-character-class': 'error',
  'regexp/no-useless-dollar-replacements': 'error',
  'regexp/no-useless-escape': 'error',
  'regexp/no-useless-flag': 'error',
  'regexp/no-useless-lazy': 'error',
  'regexp/no-useless-non-capturing-group': 'error',
  'regexp/no-useless-quantifier': 'error',
  'regexp/no-useless-range': 'error',
  'regexp/no-useless-set-operand': 'error',
  'regexp/no-useless-string-literal': 'error',
  'regexp/no-useless-two-nums-quantifier': 'error',
  'regexp/no-zero-quantifier': 'error',
  'regexp/optimal-lookaround-quantifier': 'error',
  'regexp/optimal-quantifier-concatenation': 'error',
  'regexp/prefer-character-class': 'error',
  'regexp/prefer-d': 'error',
  'regexp/prefer-escape-replacement-dollar-char': 'error',
  'regexp/prefer-lookaround': 'error',
  'regexp/prefer-named-backreference': 'error',
  'regexp/prefer-named-capture-group': 'error',
  'regexp/prefer-named-replacement': 'error',
  'regexp/prefer-plus-quantifier': 'error',
  'regexp/prefer-predefined-assertion': 'error',
  'regexp/prefer-quantifier': 'error',
  'regexp/prefer-question-quantifier': 'error',
  'regexp/prefer-range': 'error',
  'regexp/prefer-regexp-exec': 'error',
  'regexp/prefer-regexp-test': 'error',
  'regexp/prefer-result-array-groups': 'error',
  'regexp/prefer-set-operation': 'error',
  'regexp/prefer-star-quantifier': 'error',
  'regexp/prefer-unicode-codepoint-escapes': 'error',
  'regexp/prefer-w': 'error',
  'regexp/require-unicode-regexp': 'error',
  'regexp/require-unicode-sets-regexp': 'error',
  'regexp/simplify-set-operations': 'error',
  'regexp/sort-alternatives': 'error',
  'regexp/sort-character-class-elements': 'error',
  'regexp/sort-flags': 'error',
  'regexp/strict': 'error',
  'regexp/unicode-escape': 'error',
  'regexp/unicode-property': 'error',
  'regexp/use-ignore-case': 'error',
  'security/detect-bidi-characters': 'error',
  'security/detect-buffer-noassert': 'error',
  'security/detect-child-process': 'error',
  'security/detect-disable-mustache-escape': 'error',
  'security/detect-eval-with-expression': 'error',
  'security/detect-new-buffer': 'error',
  'security/detect-no-csrf-before-method-override': 'error',
  'security/detect-non-literal-fs-filename': 'error',
  'security/detect-non-literal-regexp': 'error',
  'security/detect-non-literal-require': 'error',
  'security/detect-object-injection': 'error',
  'security/detect-possible-timing-attacks': 'error',
  'security/detect-pseudoRandomBytes': 'error',
  'security/detect-unsafe-regex': 'error',
  'sonarjs/cognitive-complexity': ['error', 10],
  'sonarjs/max-switch-cases': ['error', 5],
  'sonarjs/no-duplicate-string': ['error', { threshold: 2 }],
  'sonarjs/no-identical-functions': 'error',
  'sonarjs/no-nested-switch': 'error',
  'sonarjs/no-nested-template-literals': 'error',
  'tsdoc/syntax': 'error',
  'unicorn/better-regex': 'error',
  'unicorn/catch-error-name': ['error', { name: 'error' }],
  'unicorn/consistent-destructuring': 'error',
  'unicorn/consistent-function-scoping': 'error',
  'unicorn/custom-error-definition': 'error',
  'unicorn/empty-brace-spaces': 'error',
  'unicorn/error-message': 'error',
  'unicorn/escape-case': 'error',
  'unicorn/expiring-todo-comments': [
    'error',
    {
      allowWarningComments: false,
      terms: [
        'todo',
        'fixme',
        'xxx',
      ],
    },
  ],
  'unicorn/explicit-length-check': 'error',
  'unicorn/filename-case': ['error', { case: 'kebabCase' }],
  'unicorn/import-style': 'error',
  'unicorn/new-for-builtins': 'error',
  'unicorn/no-abusive-eslint-disable': 'error',
  'unicorn/no-anonymous-default-export': 'error',
  'unicorn/no-array-callback-reference': 'error',
  'unicorn/no-array-for-each': 'error',
  'unicorn/no-array-method-this-argument': 'error',
  'unicorn/no-array-push-push': 'error',
  'unicorn/no-array-reduce': 'error',
  'unicorn/no-await-expression-member': 'error',
  'unicorn/no-console-spaces': 'error',
  'unicorn/no-document-cookie': 'error',
  'unicorn/no-empty-file': 'error',
  'unicorn/no-for-loop': 'error',
  'unicorn/no-hex-escape': 'error',
  'unicorn/no-instanceof-array': 'error',
  'unicorn/no-invalid-fetch-options': 'error',
  'unicorn/no-invalid-remove-event-listener': 'error',
  'unicorn/no-keyword-prefix': 'error',
  'unicorn/no-lonely-if': 'error',
  'unicorn/no-magic-array-flat-depth': 'error',
  'unicorn/no-negated-condition': 'error',
  'unicorn/no-negation-in-equality-check': 'error',
  'unicorn/no-nested-ternary': 'error',
  'unicorn/no-new-array': 'error',
  'unicorn/no-new-buffer': 'error',
  'unicorn/no-null': 'off',
  'unicorn/no-object-as-default-parameter': 'error',
  'unicorn/no-process-exit': 'error',
  'unicorn/no-single-promise-in-promise-methods': 'error',
  'unicorn/no-static-only-class': 'error',
  'unicorn/no-thenable': 'error',
  'unicorn/no-this-assignment': 'error',
  'unicorn/no-typeof-undefined': 'error',
  'unicorn/no-unnecessary-await': 'error',
  'unicorn/no-unnecessary-polyfills': 'error',
  'unicorn/no-unreadable-array-destructuring': 'error',
  'unicorn/no-unreadable-iife': 'error',
  'unicorn/no-unused-properties': 'error',
  'unicorn/no-useless-fallback-in-spread': 'error',
  'unicorn/no-useless-length-check': 'error',
  'unicorn/no-useless-promise-resolve-reject': 'error',
  'unicorn/no-useless-spread': 'error',
  'unicorn/no-useless-switch-case': 'error',
  'unicorn/no-useless-undefined': 'error',
  'unicorn/no-zero-fractions': 'error',
  'unicorn/number-literal-case': 'error',
  'unicorn/numeric-separators-style': 'error',
  'unicorn/prefer-add-event-listener': 'error',
  'unicorn/prefer-array-find': 'error',
  'unicorn/prefer-array-flat': 'error',
  'unicorn/prefer-array-flat-map': 'error',
  'unicorn/prefer-array-index-of': 'error',
  'unicorn/prefer-array-some': 'error',
  'unicorn/prefer-at': 'error',
  'unicorn/prefer-blob-reading-methods': 'error',
  'unicorn/prefer-code-point': 'error',
  'unicorn/prefer-date-now': 'error',
  'unicorn/prefer-default-parameters': 'error',
  'unicorn/prefer-dom-node-append': 'error',
  'unicorn/prefer-dom-node-dataset': 'error',
  'unicorn/prefer-dom-node-remove': 'error',
  'unicorn/prefer-dom-node-text-content': 'error',
  'unicorn/prefer-event-target': 'error',
  'unicorn/prefer-export-from': 'error',
  'unicorn/prefer-includes': 'error',
  'unicorn/prefer-json-parse-buffer': 'error',
  'unicorn/prefer-keyboard-event-key': 'error',
  'unicorn/prefer-logical-operator-over-ternary': 'error',
  'unicorn/prefer-math-trunc': 'error',
  'unicorn/prefer-modern-dom-apis': 'error',
  'unicorn/prefer-modern-math-apis': 'error',
  'unicorn/prefer-module': 'error',
  'unicorn/prefer-native-coercion-functions': 'error',
  'unicorn/prefer-negative-index': 'error',
  'unicorn/prefer-node-protocol': 'error',
  'unicorn/prefer-number-properties': 'error',
  'unicorn/prefer-object-from-entries': 'error',
  'unicorn/prefer-optional-catch-binding': 'error',
  'unicorn/prefer-prototype-methods': 'error',
  'unicorn/prefer-query-selector': 'error',
  'unicorn/prefer-reflect-apply': 'error',
  'unicorn/prefer-regexp-test': 'error',
  'unicorn/prefer-set-has': 'error',
  'unicorn/prefer-set-size': 'error',
  'unicorn/prefer-spread': 'error',
  'unicorn/prefer-string-replace-all': 'error',
  'unicorn/prefer-string-slice': 'error',
  'unicorn/prefer-string-starts-ends-with': 'error',
  'unicorn/prefer-string-trim-start-end': 'error',
  'unicorn/prefer-switch': 'error',
  'unicorn/prefer-ternary': 'error',
  'unicorn/prefer-top-level-await': 'error',
  'unicorn/prefer-type-error': 'error',
  'unicorn/prevent-abbreviations': ['error', {
    replacements: {
      args: false,
      props: false,
      ref: false,
      refs: false,
    },
  }],
  'unicorn/relative-url-style': ['error', 'always'],
  'unicorn/require-array-join-separator': 'error',
  'unicorn/require-number-to-fixed-digits-argument': 'error',
  'unicorn/require-post-message-target-origin': 'error',
  'unicorn/string-content': 'error',
  'unicorn/switch-case-braces': ['error', 'always'],
  'unicorn/template-indent': 'error',
  'unicorn/text-encoding-identifier-case': 'error',
  'unicorn/throw-new-error': 'error',
  'unused-imports/no-unused-imports': 'error',
  'unused-imports/no-unused-vars': [
    'error',
    {
      args: 'after-used',
      argsIgnorePattern: '^_',
      caughtErrors: 'all',
      caughtErrorsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
      vars: 'all',
      varsIgnorePattern: '^_',
    },
  ],
  'write-good-comments/write-good-comments': [
    'warn',
    {
      adverb: true,
      cliches: true,
      eprime: false,
      illusion: true,
      passive: true,
      // eslint-disable-next-line code-complete/enforce-meaningful-names -- Api argument
      so: true,
      thereIs: true,
      tooWordy: true,
      weasel: true,
      whitelist: ['read-only'],
    },
  ],
} as const);

const basePlugins = asReadOnlyDeep({
  '@brettz9': brettz9Plugin,
  '@eslint-community/eslint-comments': asPlugin(eslintCommentsPlugin),
  '@getify/proper-arrows': asPlugin(properArrowsPlugin),
  '@stylistic': stylistic,
  'array-func': asPlugin(arrayFuncPlugin),
  'code-complete': codeCompletePlugin,
  'de-morgan': asPlugin(deMorganPlugin),
  'depend': dependPlugin,
  'etc': asPlugin(etcPlugin),
  'functional': asPlugin(functionalPlugin),
  'import-newlines': asPlugin(importNewlinesPlugin),
  'import-x': importXPlugin,
  'jsdoc': jsdocPlugin,
  'misc': miscPlugin,
  'n': nPlugin,
  'no-secrets': noSecretsPlugin,
  'perfectionist': asPlugin(perfectionistPlugin),
  'prefer-arrow': asPlugin(preferArrowPlugin),
  'promise': asPlugin(promisePlugin),
  'regexp': regexpPlugin,
  'security': asPlugin(securityPlugin),
  'sonarjs': sonarjsPlugin,
  'tsdoc': tsdocPlugin,
  'unicorn': unicornPlugin,
  'unused-imports': unusedImportsPlugin,
  'write-good-comments': asPlugin(writeGoodCommentsPlugin),
} as const);

const baseSettings = asReadOnlyDeep({
  'immutability': {
    overrides: [
      {
        // eslint-disable-next-line code-complete/enforce-meaningful-names -- Config object
        to: 'Immutable',
        type: {
          from: 'package',
          name: 'ReadonlyDeep',
          package: 'type-fest',
        },
      },
    ],
  },
  'import-x/resolver': {
    typescript: true,
  },
  'jsdoc': {
    mode: 'typescript',
  },
} as const);

// eslint-disable-next-line functional/functional-parameters, @typescript-eslint/no-unsafe-type-assertion -- Not assignable, but it's fine
const configReadonlyDeep = (...configs: ReadonlyDeep<InfiniteDepthConfigWithExtends[]>): ReadonlyDeep<ConfigArray> => tseslint.config(...(configs as InfiniteDepthConfigWithExtends[])) as ReadonlyDeep<ConfigArray>;

const rules: ReadonlyDeep<ConfigArray> = configReadonlyDeep(

  /* Global ignores */
  {
    ignores: [
      'node_modules/',
      'dist/',
      'dist-tools/',
      'releases/',
      '**/*.lua',
      'pnpm-lock.yaml',
      'LICENSE.md',
      '.github/',
      '*.md',
    ],
  },

  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: { ...globals.es2025 },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        project: './tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: basePlugins,
    rules: baseRules,
    settings: baseSettings,
  },

  {
    files: ['src/control/**/*.ts'],
    languageOptions: {
      globals: { ...globals.es2025 },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        project: './tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'ban-types-in-stage': asPlugin(banTypesInStage),
    },
    rules: {
      'ban-types-in-stage/ban-types-in-stage': ['error', {
        bannedPaths: ['typed-factorio/settings', 'typed-factorio/prototype'],
        currentStage: 'control',
      }],
    },
  },
  {
    files: ['src/data/**/*.ts'],
    languageOptions: {
      globals: { ...globals.es2025 },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        project: './tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'ban-types-in-stage': asPlugin(banTypesInStage),
    },
    rules: {
      'ban-types-in-stage/ban-types-in-stage': ['error', {
        bannedPaths: ['typed-factorio/control', 'typed-factorio/settings'],
        currentStage: 'data',
      }],
    },
  },
  {
    files: ['src/settings/**/*.ts'],
    languageOptions: {
      globals: { ...globals.es2025 },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        project: './tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'ban-types-in-stage': asPlugin(banTypesInStage),
    },
    rules: {
      'ban-types-in-stage/ban-types-in-stage': ['error', {
        bannedPaths: ['typed-factorio/control', 'typed-factorio/data'],
        currentStage: 'settings',
      }],
    },
  },

  {
    files: ['src/shared/**/*.ts'],
    languageOptions: {
      globals: { ...globals.es2025 },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        project: './tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'ban-types-in-stage': asPlugin(banTypesInStage),
    },
    rules: {
      'ban-types-in-stage/ban-types-in-stage': ['error', {
        bannedPaths: ['typed-factorio/settings', 'typed-factorio/prototype', 'typed-factorio/data'],
        currentStage: 'none',
      }],
    },
  },
  {
    files: ['src/*.ts'],
    languageOptions: {
      globals: { ...globals.es2025 },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        project: './tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'ban-types-in-stage': asPlugin(banTypesInStage),
    },
    rules: {
      'ban-types-in-stage/ban-types-in-stage': ['error', {
        bannedPaths: ['typed-factorio/settings', 'typed-factorio/prototype', 'typed-factorio/data'],
        currentStage: 'none - use files in their respective stage folders',
      }],
      'import-x/no-internal-modules': 'off',
      'import-x/no-unassigned-import': 'off',
    },
  },

  {
    //  Factorio entry points.
    //  Do not remove this block!
    files: [
      'src/control/control.ts',
      'src/data/data.ts',
      'src/data/data-updates.ts',
      'src/data/data-final-fixes.ts',
      'src/settings/settings.ts',
      'src/settings/settings-updates.ts',
      'src/settings/settings-final-fixes.ts',
    ],
    rules: {
      'unicorn/no-empty-file': 'off',
    },
  },
  {
    files: ['tools/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2025,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        project: './tools/tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      ...basePlugins,
      'security-node': asPlugin(securityNodePlugin),
    },
    rules: {
      ...baseRules,
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          bundledDependencies: true,
          devDependencies: true,
          includeInternal: true,
          includeTypes: true,
          optionalDependencies: true,
          peerDependencies: true,
        },
      ],
      'import-x/no-nodejs-modules': 'off',
      'n/no-extraneous-import': 'off', // Allow importing devDependencies
      'n/no-unpublished-import': 'off', // Allow importing devDependencies
      'no-console': 'off',
      'security-node/detect-absence-of-name-option-in-exrpress-session': 'error',
      'security-node/detect-buffer-unsafe-allocation': 'error',
      'security-node/detect-child-process': 'error',
      'security-node/detect-crlf': 'error',
      'security-node/detect-dangerous-redirects': 'error',
      'security-node/detect-eval-with-expr': 'error',
      'security-node/detect-html-injection': 'error',
      'security-node/detect-improper-exception-handling': 'error',
      'security-node/detect-insecure-randomness': 'error',
      'security-node/detect-non-literal-require-calls': 'error',
      'security-node/detect-nosql-injection': 'error',
      'security-node/detect-option-multiplestatements-in-mysql': 'error',
      'security-node/detect-option-rejectunauthorized-in-nodejs-httpsrequest': 'error',
      'security-node/detect-option-unsafe-in-serialize-javascript-npm-package': 'error',
      'security-node/detect-possible-timing-attacks': 'error',
      'security-node/detect-runinthiscontext-method-in-nodes-vm': 'error',
      'security-node/detect-security-missconfiguration-cookie': 'error',
      'security-node/detect-sql-injection': 'error',
      'security-node/detect-unhandled-async-errors': 'error',
      'security-node/detect-unhandled-event-errors': 'error',
      'security-node/disable-ssl-across-node-server': 'error',
      'security-node/non-literal-reg-expr': 'error',
    },
    settings: baseSettings,
  },

  {
    files: ['eslint.config.ts', 'eslint-custom-rules/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2025,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        project: './tsconfig.eslint.json',
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: basePlugins,
    rules: {
      ...baseRules,
      // eslint-disable-next-line unicorn/no-useless-spread -- Keep these together
      ...{
        'max-lines': 'off',
        'no-console': 'off',
        'no-restricted-exports': 'off',
      },
      '@eslint-community/eslint-comments/disable-enable-pair': 'off',
      '@stylistic/max-len': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      'import-x/max-dependencies': 'off',
      'import-x/no-default-export': 'off',
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          bundledDependencies: true,
          devDependencies: true,
          includeInternal: true,
          includeTypes: true,
          optionalDependencies: true,
          peerDependencies: true,
        },
      ],
      'import-x/no-internal-modules': 'off',
      'import-x/no-nodejs-modules': 'off',
      'misc/max-identifier-blocks': 'off',
      'n/no-extraneous-import': 'off',
      'n/no-unpublished-import': 'off',
      'sonarjs/no-duplicate-string': 'off',
    },
    settings: baseSettings,
  },
);

export default rules;
