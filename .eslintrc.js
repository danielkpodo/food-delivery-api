module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 'off',
    'object-curly-newline': 'off',
    'comma-dangle': 'off',
    'no-restricted-syntax': 'off',
    'guard-for-in': 'off',
    'no-await-in-loop': 'off',
    'no-useless-constructor': 'off',
    'consistent-return': 'off',
    'array-callback-return': 'off',
    'no-path-concat': 'off',
    'prefer-template': 'off',
    'import/no-dynamic-require': 'off',
    'implicit-arrow-linebreak': 'off',
    strict: 'off',
    quotes: 'off',
    'arrow-body-style': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-return-assign': 'off',
    'no-param-reassign': 'off',
    'no-use-before-define': 'off',
    'prefer-destructuring': 'off',
    'arrow-parens': 'off',
    'import/newline-after-import': 'off',
    'global-require': 'off',
    'operator-linebreak': 'off',
  },
};
