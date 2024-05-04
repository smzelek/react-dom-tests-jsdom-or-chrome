/* eslint-disable no-restricted-properties */
// For Jest.
import chai from 'chai';
import { server } from './mocks/server';

chai.use(require('chai-dom'));

// Establish API mocking before all tests.
beforeAll(() => {
  return server.listen();
});

// https://github.com/jsdom/jsdom/issues/1695
window.HTMLElement.prototype.scrollIntoView = function () {};

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
