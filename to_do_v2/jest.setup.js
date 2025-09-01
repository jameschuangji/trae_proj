import '@testing-library/jest-dom';

// 模拟localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

// 设置全局变量
global.localStorage = new LocalStorageMock();

// 模拟console.log和console.error，避免测试输出过多日志
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
};