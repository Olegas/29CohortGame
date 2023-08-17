module.exports = {
    env: {
        browser: true,
        es2020: true,
        node: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'airbnb'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 11,
    },
    plugins: ['@typescript-eslint'],
    rules: {
        '@typescript-eslint/ban-ts-comment': 1,
        indent: ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
        'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
        'react/require-default-props': 'off',
        'react/jsx-indent-props': ['error', 4],
        'react/button-has-type': 'off',
        'react/jsx-closing-bracket-location': [1, 'after-props'],
        'import/no-unresolved': 'off',
        'import/extensions': 'off',
    },
};
