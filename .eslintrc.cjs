module.exports = {
  root: true,
  extends: ['@antfu', 'plugin:prettier/recommended'],
  rules: {
    'no-console': 'warn',
    'antfu/if-newline': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@stylistic/ts/brace-style': 'off',
    '@stylistic/js/operator-linebreak': 'off',
  },
  ignorePatterns: ['package.json', 'pnpm-lock.yaml'],
}
