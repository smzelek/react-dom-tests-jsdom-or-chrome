import { configure } from '@testing-library/react';

configure({
    getElementError: (message: string | null, _: Element) => {
        const error = new Error(message!);
        error.name = '@testing-library/react Error';
        return error;
    },
});
