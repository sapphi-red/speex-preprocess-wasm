module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/member-delimiter-style': 'off'
  },
  overrides: [
    {
      // 直下のファイル
      files: ['*.{js,cjs,mjs}'],
      excludedFiles: ['*/**/*.{js,cjs,mjs}'],
      env: {
        node: true
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ],
  reportUnusedDisableDirectives: true
}
