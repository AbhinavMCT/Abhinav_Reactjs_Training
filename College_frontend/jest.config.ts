export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
    "!src/test/**/*"
  ],

  coverageReporters: ["text", "lcov"],

  setupFilesAfterEnv: [
    "<rootDir>/src/setupTests.ts"
  ],

  moduleNameMapper: {
    "\\.(css|scss|sass|less)$": "identity-obj-proxy",
  },

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.app.json",
        compilerOptions: {
          module: "esnext"
        }
      },
    ],
  },
  
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
};