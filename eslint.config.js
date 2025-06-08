module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "@typescript-eslint/no-unused-vars": "warn",
    // другие правила
  },
};
