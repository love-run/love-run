const Notify = jest.fn((options) => {
  console.log('Notify:', options);
});

module.exports = Notify;
