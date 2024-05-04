import { setupWorker } from 'msw';
import { allUnmockedRoutesHang } from './handlers';

// This configures a request mocking server with the given request handlers.
export const worker = setupWorker(...allUnmockedRoutesHang);
