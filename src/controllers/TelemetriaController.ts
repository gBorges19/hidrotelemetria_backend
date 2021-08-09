import { Request, Response } from 'express';

import {deleteCsvFile} from '../utils/csvFilesHandler';

import GetEstacoesTelemetricasService from '../services/GetEstacoesTelemetricasService';
import GetDadosHidrometeorologicosService from '../services/GetDadosHidrometeorologicosService';
import GetDadosHidrometeorologicosByUfService from '../services/GetDadosHidrometeorologicosByUfService';



export default class TelemetriaController {
  public async getTelemetria(request: Request, response: Response): Promise<Response> {

    const {download, cod_estacao, data_inicio, data_fim} = request.body;

    const getDadosHidrometeorologicos = new GetDadosHidrometeorologicosService();

    const telemetria = await getDadosHidrometeorologicos.execute({
      download,
      cod_estacao,
      data_inicio,
      data_fim
    });

    return response.json(telemetria);
  }

  public async getEstacoes(request: Request, response: Response): Promise<Response> {

    const {download, uf} = request.body;

    const getEstacoesTelemetricasPorUf = new GetEstacoesTelemetricasService();

    const telemetria = await getEstacoesTelemetricasPorUf.execute({
      download,
      target_uf:uf,
    });

    return response.json(telemetria);
  }

  public async getTelemetriaByUf(request: Request, response: Response): Promise<Response> {

    const {download, uf, data_inicio, data_fim} = request.body;

    const getDadosHidrometeorologicosByUf = new GetDadosHidrometeorologicosByUfService();

    const telemetria = await getDadosHidrometeorologicosByUf.execute({
      download,
      target_uf:uf,
      data_inicio,
      data_fim
    });

    return response.json(telemetria);
  }

  public async downloadFile(request: Request, response: Response): Promise<void> {
    const {filename} = request.params;
    const file = `./src/temp/${filename}`;
    response.download(file,(err) => {
      if (err) {
        console.log(err);
        response.json({message:err})
      }
      //deleteCsvFile(`./src/temp/${filename}`)
    })
  }
}