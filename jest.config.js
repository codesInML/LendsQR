/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  verbose: false,
  forceExit: true,
  setupFilesAfterEnv: ["./src/mocks.ts"],
};
