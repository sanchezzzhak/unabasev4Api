// http://eslint.org/docs/user-guide/configuring

module.exports = {
  extends: ['eslint:recommended'],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 6
  },
  rules: {
    'no-console': 'off'
  }
};
