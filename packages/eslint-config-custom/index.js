module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "turbo", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["@typescript-eslint"],
}
