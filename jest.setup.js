// jest.setup.js

global.getApp = () => ({
  getUser: jest.fn().mockReturnValue({ rid: 'test_rid' }),
  getNotices: jest.fn(),
  doRead: jest.fn(),
  doDelete: jest.fn(),
  config: { getHostUrl: jest.fn().mockReturnValue('https://example.com') },
});

// 模拟微信小程序 API
global.wx = {
  request: jest.fn(),
  navigateTo: jest.fn(),
  getStorageSync: jest.fn(),
  getLocation: jest.fn(),
  showToast: jest.fn(),
  uploadFile: jest.fn(),
  navigateBack: jest.fn(),
  setNavigationBarTitle: jest.fn(),
};

// 模拟 chooseLocation 插件
global.chooseLocation = {
  getLocation: jest.fn(),
};

// 模拟 requirePlugin 函数
global.requirePlugin = jest.fn().mockReturnValue(global.chooseLocation);

// 模拟 Page 函数
global.Page = jest.fn((options) => {
  global.__pageInstance = options;
  return options;
});

// 模拟 getCurrentPages 函数
global.getCurrentPages = jest.fn(() => [
  {
    setData: jest.fn(),
    refreshMoments: jest.fn(),
  },
  global.__pageInstance,
]);
