import { rest } from "msw";
import { API_ROOT } from "src/test/constants";

export const allUnmockedRoutesHang = [
    rest.get(`${API_ROOT}/*`, (req, res, ctx) => {
        return res(
            ctx.delay('infinite'),
            ctx.status(500, 'Mocked status'),
            ctx.json({
                message: 'This request never returns.',
            })
        );
    }),
    rest.post(`${API_ROOT}/*`, (req, res, ctx) => {
        return res(
            ctx.delay('infinite'),
            ctx.status(500, 'Mocked status'),
            ctx.json({
                message: 'This request never returns.',
            })
        );
    }),
];

