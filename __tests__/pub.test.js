jest.mock('../app', () => ({
  config: {
    getHostUrl: jest.fn().mockReturnValue('https://example.com')
  },
  stopRefresh: jest.fn()
}));

global.wx = {
  request: jest.fn()
};

const app = require('../app');
const pubPage = require('../pages/pub/pub'); // 确认路径正确

let pageInstance;

beforeAll(() => {
  global.getApp = jest.fn().mockReturnValue(app);
  global.Page = jest.fn((page) => {
    pageInstance = Object.assign({}, pubPage, page); // 初始化所有方法
    pageInstance.data = {}; // 初始化 data 属性
    return pageInstance;
  });

  // 调用 Page 函数初始化 pageInstance
  Page(pubPage);
});

beforeEach(() => {
  jest.clearAllMocks();
  if (pageInstance) {
    pageInstance.data = {
      swiperArr: [],
      list: [],
      block: []
    }; // Reset data before each test
  }
});

describe('Pub Page', () => {
  it('should load swiper, list and block on load', async () => {
    const mockSwiperData = {
      data: {
        isSuccess: true,
        data: [
          { acid: 1, imgLink: '' },
          { acid: 2, imgLink: '' }
        ]
      }
    };

    const mockListData = {
      data: {
        isSuccess: true,
        data: {
          activitys: [
            { acid: 3, imgLink: '' },
            { acid: 4, imgLink: '' }
          ]
        }
      }
    };

    const mockBlockData = {
      data: {
        isSuccess: true,
        data: [
          { rcid: 5, imgLink: '' },
          { rcid: 6, imgLink: '' }
        ]
      }
    };

    wx.request
      .mockImplementationOnce((options) => {
        options.success(mockSwiperData);
      })
      .mockImplementationOnce((options) => {
        options.success(mockListData);
      })
      .mockImplementationOnce((options) => {
        options.success(mockBlockData);
      });

    if (typeof pageInstance.onLoad === 'function') {
      await pageInstance.onLoad();
    } else {
      throw new Error('onLoad is not a function');
    }

    expect(pageInstance.data.swiperArr.length).toBe(2);
    expect(pageInstance.data.swiperArr[0].imgLink).toBe('listDetail/listDetail?acid=1');

    expect(pageInstance.data.list.length).toBe(2);
    expect(pageInstance.data.list[0].imgLink).toBe('listDetail/listDetail?acid=3');

    expect(pageInstance.data.block.length).toBe(2);
    expect(pageInstance.data.block[0].imgLink).toBe('blockDetail/blockDetail?rcid=5');
  });

  it('should refresh data on pull down', async () => {
    const mockSwiperData = {
      data: {
        isSuccess: true,
        data: [
          { acid: 1, imgLink: '' },
          { acid: 2, imgLink: '' }
        ]
      }
    };

    const mockListData = {
      data: {
        isSuccess: true,
        data: {
          activitys: [
            { acid: 3, imgLink: '' },
            { acid: 4, imgLink: '' }
          ]
        }
      }
    };

    const mockBlockData = {
      data: {
        isSuccess: true,
        data: [
          { rcid: 5, imgLink: '' },
          { rcid: 6, imgLink: '' }
        ]
      }
    };

    wx.request
      .mockImplementationOnce((options) => {
        options.success(mockSwiperData);
      })
      .mockImplementationOnce((options) => {
        options.success(mockListData);
      })
      .mockImplementationOnce((options) => {
        options.success(mockBlockData);
      });

    if (typeof pageInstance.onPullDownRefresh === 'function') {
      await pageInstance.onPullDownRefresh();
    } else {
      throw new Error('onPullDownRefresh is not a function');
    }

    expect(pageInstance.data.swiperArr.length).toBe(2);
    expect(pageInstance.data.swiperArr[0].imgLink).toBe('listDetail/listDetail?acid=1');

    expect(pageInstance.data.list.length).toBe(2);
    expect(pageInstance.data.list[0].imgLink).toBe('listDetail/listDetail?acid=3');

    expect(pageInstance.data.block.length).toBe(2);
    expect(pageInstance.data.block[0].imgLink).toBe('blockDetail/blockDetail?rcid=5');
    expect(app.stopRefresh).toHaveBeenCalled();
  });
});
