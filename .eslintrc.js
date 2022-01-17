module.exports = {
    env: {
        es2021: true,
        node: true
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint'],
    rules: {
        '@typescript-eslint/no-explicit-any': 0,
        'prefer-spread': 0
    }
};
