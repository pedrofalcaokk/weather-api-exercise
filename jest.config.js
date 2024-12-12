// eslint-disable-next-line no-undef
module.exports = {
  testEnvironment: "node",
  preset: 'ts-jest',
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/types/**/*.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/app.ts",
    "/src/index.ts"
  ]
};
