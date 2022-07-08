// This is just a hack to make Chai's "expect" function work with Jasmine reporters.
import * as chai from 'chai';

let result: jasmine.SpecResult;

const reporterCurrentSpec = {
    specStarted: function (_result: jasmine.SpecResult) {
        result = _result;
    }
};

// Keep Jest happy, if running on Jest.
if (global.jasmine) {
    jasmine.getEnv().addReporter(reporterCurrentSpec);
}

export const expect = (actual: any, message?: string) => {
    if (result) {
        try {
            chai.expect(actual, message)
            result.passedExpectations.push({} as any)
        }
        catch (err) {
            result.failedExpectations.push({} as any)
        }
    }

    return chai.expect(actual, message);
}
