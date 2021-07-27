import {Router} from 'express';

import telemetriaRouter from './telemetria.routes';

const routes = Router();

routes.use('/telemetriaInfo',telemetriaRouter);



export default routes;