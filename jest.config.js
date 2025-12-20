module.exports = {
    preset: 'jest-preset-angular',
    testMatch: ['**/+(*.)+(spec).+(ts)'],
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testEnvironment: 'jsdom',
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};
