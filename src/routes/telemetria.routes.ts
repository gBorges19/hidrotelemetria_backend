import { Router } from 'express';

import TelemetriaController from '../controllers/TelemetriaController';

const telemetriaRouter = Router();

const telemetriaController = new TelemetriaController();

telemetriaRouter.post('/estacoes', telemetriaController.getEstacoes);

telemetriaRouter.post('/dadosHidrometeorologicos', telemetriaController.getTelemetria);

telemetriaRouter.post('/dadosHidrometeorologicosPorUf', telemetriaController.getTelemetriaByUf);

telemetriaRouter.get('/download/:filename',telemetriaController.downloadFile);

export default telemetriaRouter;
