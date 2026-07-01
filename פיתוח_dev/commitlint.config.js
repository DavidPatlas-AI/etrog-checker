module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',
                'fix',
                'docs',
                'style',
                'refactor',
                'perf',
                'test',
                'chore',
                'revert',
                'ci',
                'build'
            ]
        ],
        'scope-enum': [
            2,
            'always',
            [
                'app',
                'ui',
                'api',
                'db',
                'auth',
                'config',
                'camera',
                'ai',
                'business',
                'analytics'
            ]
        ]
    }
}; 