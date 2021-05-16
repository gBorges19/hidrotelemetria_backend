import { Router } from 'express';

import TelemetriaController from '../controllers/TelemetriaController';

const telemetriaRouter = Router();

const telemetriaController = new TelemetriaController();

telemetriaRouter.get('/:cod_estacao/:data_inicio/:data_fim', telemetriaController.getTelemetria);

export default telemetriaRouter;
