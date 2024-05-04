/* eslint-disable no-restricted-properties */

/* eslint-disable no-restricted-globals */
// This is just a hack to make Jasmine reporters understand
// "assert" from sinon and "expect" from Chai as expectations,
// otherwise Jasmine will warn that a spec has no expectations.
import * as chai from 'chai';
import sinon, { SinonFakeTimersConfig } from 'sinon';

let result: jasmine.SpecResult | undefined = undefined;

const reporterCurrentSpec = {
  specStarted: function (_result: jasmine.SpecResult) {
    result = _result;
  },
};

// Keep Jest happy, if running on Jest.
if (global.jasmine) {
  jasmine.getEnv().addReporter(reporterCurrentSpec);
}

export const expect = (actual: unknown, message?: string): Chai.Assertion => {
  try {
    chai.expect(actual, message);
    result?.passedExpectations.push({ message: message ?? '', passed: true, matcherName: '', stack: '' });
  } catch (err) {
    result?.failedExpectations.push({
      message: message ?? '',
      passed: false,
      matcherName: '',
      stack: '',
      actual: typeof actual === 'string' ? actual : '',
      expected: '',
    });
  }

  return chai.expect(actual, message);
};

export const assert: sinon.SinonAssert = (() => {
  const fail = sinon.assert.fail.bind(sinon);
  const pass = sinon.assert.pass.bind(sinon);

  sinon.assert.pass = (assertion: unknown) => {
    result?.passedExpectations.push({ message: '', passed: true, matcherName: '', stack: '' });
    return pass(assertion);
  };

  sinon.assert.fail = (message?: string | undefined) => {
    result?.failedExpectations.push({ message: message ?? '', passed: false, matcherName: '', stack: '', actual: '', expected: '' });
    return fail(message);
  };

  return sinon.assert;
})();

export const mockTimeouts = (props: Partial<SinonFakeTimersConfig> = {}) => sinon.useFakeTimers({ ...props });

export const mockApi = async () => {
  if (global.jasmine) {
    return (await import('src/test/mocks/worker')).worker;
  }

  // Avoid importing this during Karma bundle, since this will bring in Node packages that don't work in the browser.
  return (await import(/* webpackIgnore: true */ 'src/test/mocks/server')).server;
};
