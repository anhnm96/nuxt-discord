module.exports = {
  root: true,
  extends: [
    '@antfu',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
    'antfu/if-newline': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@stylistic/ts/brace-style': 'off',
    '@stylistic/js/operator-linebreak': 'off',
    'n/prefer-global/process': 'off',
    'vue/require-toggle-inside-transition': 'off',
    '@tanstack/query/exhaustive-deps': 'off',
  },
  ignorePatterns: ['package.json', 'pnpm-lock.yaml'],
}
