module.exports = {
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.test.js'],
  setupFiles: ['<rootDir>/__tests__/setup/env.js'],
  moduleFileExtensions: ['js', 'json'],
  testTimeout: 60000,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['src/**/*.js', '!src/index.js'],
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      lines: 80,
      statements: 80,
      functions: 75,
      branches: 60
    }
  }
};
