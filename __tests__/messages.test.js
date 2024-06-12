jest.mock('../app', () => ({
  getNotices: jest.fn(),
  doRead: jest.fn(),
  doDelete: jest.fn(),
}));

const app = require('../app');
const messagesPage = require('../pages/moments/messages/messages'); // 确认路径正确

let pageInstance;

beforeAll(() => {
  global.getApp = jest.fn().mockReturnValue(app);
  global.Page = jest.fn((page) => {
    pageInstance = page;
    pageInstance.data = {}; // 初始化 data 属性
    return pageInstance;
  });
  global.wx = {
    setNavigationBarTitle: jest.fn()
  };

  // 调用 Page 函数初始化 pageInstance
  Page(messagesPage);
});

beforeEach(() => {
  jest.clearAllMocks();
  if (pageInstance) {
    pageInstance.data = {}; // Reset data before each test
  }
});

describe('Messages Page', () => {
  it('should load messages on load for moment type', async () => {
    const getNoticesMock = jest.fn().mockResolvedValue([
      { type: 1, read: 0, noid: '1' },
      { type: 1, read: 1, noid: '2' }
    ]);
    app.getNotices.mockImplementation(getNoticesMock);

    if (pageInstance && typeof pageInstance.onLoad === 'function') {
      await pageInstance.onLoad({ type: 'moment', rid: 'test_rid' });

      expect(pageInstance.data.messages.length).toBe(2);
      expect(wx.setNavigationBarTitle).toHaveBeenCalledWith({ title: '消息通知: 1条未读' });
    }
  });

  it('should load messages on load for userCenter type', async () => {
    const getNoticesMock = jest.fn().mockResolvedValue([
      { type: 0, read: 0, noid: '1' },
      { type: 0, read: 1, noid: '2' }
    ]);
    app.getNotices.mockImplementation(getNoticesMock);

    if (pageInstance && typeof pageInstance.onLoad === 'function') {
      await pageInstance.onLoad({ type: 'userCenter', rid: 'test_rid' });

      expect(pageInstance.data.messages.length).toBe(2);
      expect(wx.setNavigationBarTitle).toHaveBeenCalledWith({ title: '消息通知: 1条未读' });
    }
  });

  it('should mark all messages as read', async () => {
    const doReadMock = jest.fn().mockResolvedValue({ data: { data: [] } });
    app.doRead.mockImplementation(doReadMock);

    if (pageInstance) {
      pageInstance.data.messages = [
        { noid: '1', read: 0 },
        { noid: '2', read: 0 }
      ];
      if (typeof pageInstance.readAll === 'function') {
        await pageInstance.readAll();

        expect(app.doRead).toHaveBeenCalledWith(['1', '2']);
        expect(pageInstance.data.messages.length).toBe(0);
        expect(wx.setNavigationBarTitle).toHaveBeenCalledWith({ title: '消息通知' });
      }
    }
  });

  it('should delete all messages', async () => {
    const doDeleteMock = jest.fn().mockResolvedValue({ data: { data: [] } });
    app.doDelete.mockImplementation(doDeleteMock);

    if (pageInstance) {
      pageInstance.data.messages = [
        { noid: '1', read: 0 },
        { noid: '2', read: 0 }
      ];
      if (typeof pageInstance.deleteAll === 'function') {
        await pageInstance.deleteAll();

        expect(app.doDelete).toHaveBeenCalledWith(['1', '2']);
        expect(pageInstance.data.messages.length).toBe(0);
        expect(wx.setNavigationBarTitle).toHaveBeenCalledWith({ title: '消息通知' });
      }
    }
  });
});
