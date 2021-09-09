module.exports = {
    root: true,
    env: {
        node: true
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    rules: {
        indent: [ "error", 4, { SwitchCase: 1 } ],
        quotes: [ "error", "double" ],
        semi: [ "error", "always" ],
        "space-before-function-paren": 0,
        "object-curly-spacing": [ "error", "always" ],
        "array-bracket-spacing": [ "error", "always" ]
    }
};
