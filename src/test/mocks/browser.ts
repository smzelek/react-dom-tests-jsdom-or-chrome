import { RestHandler, setupWorker } from 'msw';

const handlers: RestHandler[] = [];
export const worker = setupWorker(...handlers);

export const startWorker = () => {
  window.localStorage.setItem('key', 'value');
  worker.start();
  worker.use(...handlers);
};
