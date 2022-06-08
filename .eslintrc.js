module.exports = {
  extends: ["react-app", "plugin:prettier/recommended"],
  plugins: ["unused-imports"],
  rules: {
    "unused-imports/no-unused-imports": "error",
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/rules-of-hooks": "warn",
    "react/jsx-no-literals": "warn",
    "react/react-in-jsx-scope": "off",
    "prefer-const": "warn",
    "object-shorthand": ["error", "properties"],
  },
};
