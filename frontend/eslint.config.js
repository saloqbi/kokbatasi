import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

export default [
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...Object.fromEntries(
          Object.entries({
            ...globals.browser,
            ...globals.node,
            ...globals.jest,
          }).map(([key, value]) => [key.trim(), value])
        ),
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // في حال استخدام React 17+
      "react/prop-types": "warn",
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
