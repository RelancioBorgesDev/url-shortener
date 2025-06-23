/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
  },
  testMatch: ["**/test/e2e/**/*.e2e-spec.ts"],
  setupFiles: ["dotenv/config"],
  testTimeout: 20000,
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};
