module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'jest',
    ],
    env: {
        'jest/globals': true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:jest/recommended',
    ],
    rules: {
        quotes: ["error", "single", { "allowTemplateLiterals": true }],
    },
};
