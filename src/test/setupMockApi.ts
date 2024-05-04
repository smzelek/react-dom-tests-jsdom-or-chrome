// For the Jasmine test suite.
import { SetupWorker } from 'msw';
import { mockApi } from '.';

// Establish API mocking before all tests.
beforeAll(async () => {
  const api = (await mockApi()) as SetupWorker;
  await api.start({
    quiet: true,
    onUnhandledRequest: (request, print) => {
      if (/^\/(img|sprites|absolute|assets)\/.*/.test(request.url.pathname)) {
        return;
      }
      print.warning();
    },
  });
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
beforeEach(async () => {
  const api = (await mockApi()) as SetupWorker;
  api.resetHandlers();
});

afterEach(async () => {
  const api = (await mockApi()) as SetupWorker;
  api.resetHandlers();
});

// Clean up after the tests are finished.
afterAll(async () => {
  const api = (await mockApi()) as SetupWorker;
  api.stop();
});
