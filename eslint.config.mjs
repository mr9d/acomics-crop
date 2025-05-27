import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {
    languageOptions: {
      globals: globals.browser
    },
    overrides: [
      {
        files: ["release.js", "webpack.config.js"],
        languageOptions: {
          globals: globals.node
        }
      }
    ]
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      semi: "error",
      "prefer-const": "error",
      indent: ["error", 2],
      eqeqeq: ["error", "always"],
    }
  },
];
