export default {
  preset: "ts-jest",

  testEnvironment: "jsdom",

  setupFilesAfterEnv: [
    "<rootDir>/src/setupTests.ts"
  ],

  moduleNameMapper: {
    "\\.(css|scss|sass|less)$":
      "identity-obj-proxy",
  },

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.app.json",
      },
    ],
  },
};