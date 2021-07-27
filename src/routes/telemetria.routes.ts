import { Router } from 'express';

import TelemetriaController from '../controllers/TelemetriaController';

const telemetriaRouter = Router();

const telemetriaController = new TelemetriaController();

//telemetriaRouter.get('/:cod_estacao/:data_inicio/:data_fim', telemetriaController.getTelemetria);

//telemetriaRouter.get('/estacoes', telemetriaController.getEstacoes);

telemetriaRouter.post('/estacoes', telemetriaController.getEstacoes);


export default telemetriaRouter;
