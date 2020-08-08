module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: "./tsconfig.json"
    },
    plugins: ["@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    rules: {
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "semi": ["error", "always"],
        "linebreak-style": "off",
        "quotes": ["error", "double"],
        "@typescript-eslint/no-unnecessary-type-assertion": ["error", {"typesToIgnore": ["FunctionalModule"]}],
    }
};
