import globals from "globals"
import pluginJs from "@eslint/js"


export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
  },
  {
    rules: {
      indent: ["error", 2],
      semi: ["error", "never"],
      "no-unused-vars": "warn",
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true }
      ]
    }
    // ...other configuration
  },
  {
    languageOptions: {
      globals: globals.node
    }
  },
  pluginJs.configs.recommended,
  {
    ignores: ["**/temp.js", "dist/*","node_modules/*"]
  }
]