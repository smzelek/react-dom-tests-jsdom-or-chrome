import { configure } from '@testing-library/react';
import * as chai from 'chai';
chai.use(require('chai-dom'));

configure({
    getElementError: (message: string | null, _: Element) => {
        const error = new Error(message!);
        error.name = '@testing-library/react Error';
        return error;
    },
});
