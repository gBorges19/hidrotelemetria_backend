import { Request, Response } from 'express';

import GetTelemetriaAnaService from '../services/GetTelemetriaAnaService';

export default class TelemetriaController {
  public async getTelemetria(request: Request, response: Response): Promise<Response> {

    const { cod_estacao, data_inicio, data_fim } = request.params;

    const getTelemetriaAna = new GetTelemetriaAnaService();

    const telemetria = await getTelemetriaAna.execute({
      cod_estacao,
      data_inicio,
      data_fim
    });

    return response.json(telemetria);
  }
}
