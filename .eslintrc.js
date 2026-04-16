module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
    ],
    env: {
        node: true,
        es6: true,
    },
    rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
    },
};
