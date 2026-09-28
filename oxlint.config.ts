import {defineConfig} from 'oxlint';

export default defineConfig({
    plugins: ['typescript', 'unicorn', 'oxc', 'import', 'react'],
    categories: {
        correctness: 'error',
        suspicious: 'warn',
        perf: 'warn',
    },
    rules: {
        'typescript/consistent-type-imports': 'error',
        'typescript/no-explicit-any': 'error',
        'unicorn/prefer-node-protocol': 'error',
        'import/no-cycle': 'error',
        // the resolver is exported as default and named on purpose
        'import/no-named-as-default': 'off',
        // jsx runtime is automatic
        'react/react-in-jsx-scope': 'off',
    },
    overrides: [
        {
            files: ['src/tests/**'],
            rules: {
                'typescript/no-explicit-any': 'off',
                'eslint/no-shadow': 'off',
                'eslint/no-unused-vars': 'off',
                'eslint/no-empty-pattern': 'off',
                'unicorn/consistent-function-scoping': 'off',
            },
        },
    ],
    ignorePatterns: ['dist', 'coverage', 'src/tests/Test.tsx'],
});
