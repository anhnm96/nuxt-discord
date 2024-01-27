module.exports = {
  root: true,
  extends: [
    '@antfu',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-console': 'warn',
    'antfu/if-newline': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@stylistic/ts/brace-style': 'off',
    '@stylistic/js/operator-linebreak': 'off',
    'n/prefer-global/process': 'off',
  },
  ignorePatterns: ['package.json', 'pnpm-lock.yaml'],
}
