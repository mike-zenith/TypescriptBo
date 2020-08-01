import express from 'express';
import routes from './productions/infrastructure/Routes';

export function createApplication(): express.Express {

    const app = express();
    app.use(express.raw({ type: 'application/json' }));
    app.use('/productions', routes);

    return app;
}
