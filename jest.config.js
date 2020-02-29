module.exports = {
    coverageDirectory: '__tests__/coverage',
    coverageReporters: ['lcov', 'html'],
    collectCoverageFrom: ['src/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
    transform: {'.*': '<rootDir>/jest/preprocessor.js'},
    setupFilesAfterEnv: ['<rootDir>/jest/config.js'],
    testPathIgnorePatterns: ['/node_modules/', '/test/e2e/'],
    testRegex: '(/test/unit/.*|\\.(test|spec))\\.(ts|tsx|js)$',
    moduleFileExtensions: ['ts', 'tsx', 'js']
};
