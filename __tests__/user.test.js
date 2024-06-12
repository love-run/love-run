jest.mock('../app', () => ({
  config: {
    getHostUrl: jest.fn().mockReturnValue('https://example.com')
  },
  getOpenid: jest.fn().mockResolvedValue('test_openid'),
  updateNotices: jest.fn().mockResolvedValue({ system: 5 }),
  stopRefresh: jest.fn(),
  getUser: jest.fn().mockReturnValue({ rid: 'test_rid' })
}));

global.wx = {
  request: jest.fn(),
  navigateTo: jest.fn(),
  getStorageSync: jest.fn().mockReturnValue(JSON.stringify({ rid: 'test_rid' })),
  setStorageSync: jest.fn(),
  getStorageInfo: jest.fn().mockImplementation(({ success }) => {
    success({ currentSize: 0 });
  }),
  clearStorageSync: jest.fn()
};

const app = require('../app');
const userPage = require('../pages/user/user'); // 确认路径正确

let pageInstance;

beforeAll(() => {
  global.getApp = jest.fn().mockReturnValue(app);
  global.Page = jest.fn((page) => {
    pageInstance = { ...userPage, ...page }; // 初始化所有方法
    pageInstance.data = { ...userPage.data }; // 初始化 data 属性
    return pageInstance;
  });

  // 调用 Page 函数初始化 pageInstance
  Page(userPage);
});

beforeEach(() => {
  jest.clearAllMocks();
  if (pageInstance) {
    pageInstance.data = {
      user: {
        img: "/imgs/default/girl.jpg"
      },
      unreadMessagesNum: 0,
      isUnsigned: true,
      medals: [],
      isShowSettingMenu: false,
      isShowProtocol: false,
      cacheSize: '0kB',
      isShowloading: false,
    };
  }
});

describe('User Page', () => {
  it('should initialize data on load', async () => {
    wx.request.mockImplementationOnce((options) => {
      options.success({ data: { isSuccess: true, data: { rid: 'test_rid' } } });
    });

    await pageInstance.onLoad();

    expect(wx.request).toHaveBeenCalled();
    expect(pageInstance.data.user.rid).toBe('test_rid');
  });

  it('should update unread messages on show', async () => {
    await pageInstance.onShow();

    expect(app.updateNotices).toHaveBeenCalledWith({ read: 0, type: 0 });
    expect(pageInstance.data.unreadMessagesNum).toBe(5);
  });

  it('should refresh data on pull down', async () => {
    wx.request.mockImplementationOnce((options) => {
      options.success({ data: { isSuccess: true, data: { rid: 'test_rid' } } });
    });

    await pageInstance.onPullDownRefresh();

    expect(wx.request).toHaveBeenCalled();
    expect(app.stopRefresh).toHaveBeenCalled();
    expect(pageInstance.data.user.rid).toBe('test_rid');
  });

  it('should navigate to edit page', async () => {
    pageInstance.goToEdit();

    expect(wx.navigateTo).toHaveBeenCalledWith(expect.objectContaining({
      url: 'edit/edit'
    }));
  });

  it('should navigate to preview page', async () => {
    pageInstance.goToPreview();

    expect(wx.navigateTo).toHaveBeenCalledWith(expect.objectContaining({
      url: 'userPage/userPage'
    }));
  });

  it('should navigate to system message page', async () => {
    pageInstance.goToSystemMessage();

    expect(wx.navigateTo).toHaveBeenCalledWith(expect.objectContaining({
      url: '/pages/moments/messages/messages?rid=test_rid&type=userCenter'
    }));
  });

  it('should navigate to my moments page', async () => {
    pageInstance.goToMyMoments();

    expect(wx.navigateTo).toHaveBeenCalledWith(expect.objectContaining({
      url: 'myMoments/myMoments'
    }));
  });

  it('should navigate to my runs page', async () => {
    pageInstance.goToMyRuns();

    expect(wx.navigateTo).toHaveBeenCalledWith(expect.objectContaining({
      url: 'myRuns/myRuns?rid=test_rid'
    }));
  });
});
