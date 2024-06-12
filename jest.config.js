module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover"],
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  moduleNameMapper: {
    '^@vant/weapp/dialog/dialog$': '<rootDir>/__mocks__/@vant/weapp/dialog/dialog.js',
    '^@vant/weapp/toast/toast$': '<rootDir>/__mocks__/@vant/weapp/toast/toast.js',
    '^@vant/weapp/notify/notify$': '<rootDir>/__mocks__/@vant/weapp/notify/notify.js',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
};
