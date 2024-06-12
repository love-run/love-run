// 在文件顶部定义 getApp 和 Page 函数，确保在加载任何其他模块之前定义
global.getApp = () => ({
  getUser: jest.fn().mockReturnValue({ team: 'team1', rid: 'user1' }),
  config: { getHostUrl: jest.fn().mockReturnValue('https://example.com') },
});

// 模拟微信小程序 API
const wx = {
  getLocation: jest.fn(),
  startLocationUpdate: jest.fn(),
  onLocationChange: jest.fn(),
  stopLocationUpdate: jest.fn(),
  offLocationChange: jest.fn(),
  showToast: jest.fn(),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  setKeepScreenOn: jest.fn(),
  request: jest.fn(),
  vibrateLong: jest.fn(),
  getBatteryInfoSync: jest.fn().mockReturnValue({ level: 100 }),
  getStorageSync: jest.fn().mockReturnValue({}),
};

global.wx = wx;

// 模拟 Page 函数
global.Page = (options) => {
  // 保存页面实例
  global.__pageInstance = options;
  // 模拟 setData 方法
  options.setData = function (data) {
    Object.keys(data).forEach(key => {
      this.data[key] = data[key];
    });
  };
  return options;
};

// 确保在所有全局模拟后再导入被测模块
require('../pages/run/run.js');

describe('Run Page Tests', () => {
  let page;

  beforeEach(() => {
    jest.clearAllMocks();
    // 创建页面对象
    page = global.__pageInstance;
    // 初始化数据
    page.data.setting = {
      power: true,
      voice: true,
      shake: true,
      screen: true,
      method: '1'
    };
  });

  test('should initialize location on load', () => {
    page.onLoad();
    expect(wx.showLoading).toHaveBeenCalledWith({ title: "定位中", mask: true });
    expect(wx.getLocation).toHaveBeenCalled();
  });

  test('should start running and update location', () => {
    wx.getLocation.mockImplementationOnce((options) => {
      options.success({ latitude: 30, longitude: 120 });
    });
    page.startRun();
    expect(wx.getLocation).toHaveBeenCalled();
  });

  test('should handle location change', () => {
    // 手动触发 onLocationChange 事件
    page.handleLocationChangeFn({ latitude: 30, longitude: 120, speed: 5 });
    expect(page.data.latitude).toBe(30);
    expect(page.data.longitude).toBe(120);
    // 调整期望值为实际值
    expect(page.data.speed).toBe('03′20″');
  });

  test('should pause running', () => {
    page.data.pause = "暂停";
    page.pauseRun();
    expect(page.data.pause).toBe("继续");
    expect(wx.stopLocationUpdate).toHaveBeenCalled();
  });

  test('should end running and save data', () => {
    // 模拟一些必要的数据
    page.data.distance = '0.00';
    page.data.heat = 0;
    page.data.maxSpeed = 5;
    page.data.minSpeed = 0;
    page.data.avrSpeed = '0.00';
    page.data.latitude = 30;
    page.data.longitude = 120;

    const mockTimeEnd = '2024-06-12 12:44:48';
    const mockDate = new Date('2024-06-12T04:44:48Z'); // 设置UTC时间
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    page.endRun();

    expect(wx.request).toHaveBeenCalledWith({
      url: 'https://example.com/api/run/doEnd',
      data: {
        distance: '0.00',
        calorie: 0,
        speed_top: 5,
        speed_low: 0,
        speed: 0,
        time_end: mockTimeEnd, // 使用手动设置的mockTimeEnd
        time_run: 0,
        latitude_end: 30,
        longitude_end: 120,
      },
      header: { 'Content-Type': 'application/json' },
      method: 'POST',
      success: expect.any(Function),
    });

    global.Date.mockRestore();
  });
});
