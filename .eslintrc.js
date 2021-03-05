// eslint-disable-next-line no-undef
module.exports = {
    // root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'airbnb-typescript',
      'react-app',
    ],
    parserOptions: {
        project: './tsconfig.json',
    },
    rules :{
      // "@typescript-eslint/no-unused-expressions": ["error", { "allowTernary": true }],
      "@typescript-eslint/naming-convention": [ "warn", {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      }],
      "object-curly-spacing": ["warn", "always"], 
      "object-curly-newline": "off",

      "max-len": [
        "warn",
        {
          "code": 120,
          "ignoreStrings": true,
          "ignoreTemplateLiterals": true,
          "ignoreComments": true
        }
      ],
      "no-plusplus": [
        "error",
        {
          "allowForLoopAfterthoughts": true
        }
      ],
      "react/jsx-key": "error",
      "import/no-extraneous-dependencies": [
        "error",
        {
          "devDependencies": [
            "**/*.test.js",
            "**/*.test.jsx",
            "**/*.test.ts",
            "**/*.test.tsx",
            "src/tests/**/*"
          ]
        }
      ],
      "react/jsx-props-no-spreading": "off",
      "import/prefer-default-export": "off",
      "react/jsx-boolean-value": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "react/jsx-one-expression-per-line": "off",
      "react/jsx-wrap-multilines": "off",
      "react/destructuring-assignment": "off",
      "no-underscore-dangle":"off", 
      
      // remove below to check before prod: 
      "no-console" : "off"

    }
};