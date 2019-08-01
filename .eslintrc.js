// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/base','airbnb-base'],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    'no-param-reassign': 0,
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-shadow': 0,
    'arrow-body-style': 0,
    'no-underscore-dangle': 0,
    'strict': 0,
    'semi': 0,
    'import/no-unresolved': 0,
    "func-names": 0,
    "consistent-return": 0,
    "no-console": 0,
    "import/extensions": 0,
    "no-restricted-syntax": 0,
    "no-unused-vars": 0,
    "no-extend-native": 0,
    "max-len": 0,
    "no-continue": 0,
    "guard-for-in": 0,
    "vue/require-default-prop": 0,
    "radix": 0,
    "space-before-function-paren": 2,
    "no-unused-expressions": 0,
    "no-plusplus": 0,
    "prefer-default-export": 0,
    "class-methods-use-this": 0,
    "vue/no-use-v-if-with-v-for": 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
