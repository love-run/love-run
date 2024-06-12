module.exports = {
  toast: jest.fn(() => Promise.resolve()),
  loading: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
};
