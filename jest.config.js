module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: "(tests/.*\.spec\.ts)$",
    verbose: true,
    maxConcurrency: 10,
    roots: ['<rootDir>/tests'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    coverageReporters: ['json', 'lcov', 'text', 'clover']
}
