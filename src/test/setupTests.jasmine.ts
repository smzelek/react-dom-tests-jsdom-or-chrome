// For the Jasmine test suite.
import { configure } from '@testing-library/react';
import chai from 'chai';

declare let window: Window;

declare global {
  interface Window {
    process: unknown;
  }
}

chai.use(require('chai-dom'));

configure({
  getElementError: (message: string | null, _: Element) => {
    const error = new Error(message!);
    error.name = '@testing-library/react Error';
    return error;
  },
});

window.process = {
  env: {
    REACT_APP_IONIC_SITE_URL: 'https://ionicframework.com/',
    REACT_APP_STRIPE_PUBLISHABLE_KEY: 'pk_test_ZouHESVH8Kw39jGkrZWhrOFX',
  },
};

const defineProperty = Object.defineProperty;
Object.defineProperty = (o, p, c) => defineProperty(o, p, Object.assign({}, c ?? {}, { configurable: true }));
