module.exports = {
  root: true,
  env: { es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['generated-for-ui', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  rules: {
    "semi": ["error", "never"],
    "no-multiple-empty-lines": ["error", { "max": 1 }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "indent": ["error", 2],
    "no-return-assign": 0,
    "multiline-ternary": 0,
    "object-curly-spacing": 0,
    "object-property-newline": 0,
    "object-curly-newline": 0,
    "quotes": 0,
    "quote-props": 0,
    "import/no-absolute-path": 0,
  }
}
