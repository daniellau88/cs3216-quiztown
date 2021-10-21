module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true,
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true,
        },
        'ecmaVersion': 12,
        'sourceType': 'module',
    },
    'plugins': [
        'react',
        '@typescript-eslint',
        'react-hooks',
    ],
    'rules': {
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'no-multi-spaces': ['error'],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-types': [
            'error',
            {
                extendDefaults: true,
                types: {
                    '{}': false,
                },
            },
        ],
        'import/order': [
            'error', {
                'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
                'newlines-between': 'always',
                'alphabetize': {
                    'order': 'asc', /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
                    'caseInsensitive': true, /* ignore case. Options: [true, false] */
                },
            },
        ],
        'sort-imports': ['error', { 'ignoreDeclarationSort': true }],
        'comma-dangle': ['error', 'always-multiline'],
        'react-hooks/rules-of-hooks': 'warn',
        'react-hooks/exhaustive-deps': 'warn',

    },
};
