const { join } = require('path');
const runIntegrationTests = process.env.RUN_INTEGRATION_TESTS === 'true';

const setupFile = '<rootDir>/__tests__/setup.ts';

const integrationTestConfig = {
  rootDir: 'src',
  setupFilesAfterEnv: [setupFile, '<rootDir>/__tests__/integration/setup.ts'],
};

const unitTestConfig = {
  rootDir: 'src',
  testPathIgnorePatterns: ['/integration/'],
  setupFilesAfterEnv: [setupFile],
};

module.exports = {
  preset: 'ts-jest',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: ['<rootDir>/**/*.ts'],
  coverageDirectory: join(__dirname, 'coverage'),
  ...(runIntegrationTests ? integrationTestConfig : unitTestConfig),
};
