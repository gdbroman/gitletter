module.exports = {
  extends: ["react-app", "plugin:prettier/recommended"],
  plugins: ["unused-imports", "simple-import-sort"],
  rules: {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/rules-of-hooks": "warn",
    "react/jsx-no-literals": "warn",
    "prefer-const": "warn",
    "object-shorthand": ["error", "properties"],
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
};
