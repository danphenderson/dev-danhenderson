module.exports = {
  roots: ['<rootDir>/test/unit', '<rootDir>/src'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/unit/**/*.test.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/test/unit/__mocks__/styleMock.cjs',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp|avif|woff|woff2|pdf)$':
      '<rootDir>/test/unit/__mocks__/fileMock.cjs',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/build/'],
};
