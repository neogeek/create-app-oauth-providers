/** @type {import('jest').Config} */
const jestConfig = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': 'ts-jest/legacy',
  },
  testEnvironment: 'node',
  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['index.ts'],
};

export default jestConfig;
