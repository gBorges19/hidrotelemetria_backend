import {v4 as uuid} from 'uuid'
import {saveJsonAsCsvFile} from '../utils/csvFilesHandler';

import GetEstacoesTelemetricasService from './GetEstacoesTelemetricasService';
import GetDadosHidrometeorologicosService from './GetDadosHidrometeorologicosService';


interface IResponseDTO {
    hidrotelemetria: ITargetAnaFields[];
    generatedFileName: string;
}

interface IRequestDTO {
    download: boolean;
    target_uf: string;
    data_inicio: string;
    data_fim: string;
}

interface IEstacoesTelemetricas {
    NomeEstacao: string;
    CodEstacao:string;
    StatusEstacao: string;
    MunicipioUF: string;
    Latitude: string;
    Longitude: string;
    Altitude: string;
    Operadora: string;
    Responsavel: string;
    Origem: string;
    Bacia: string;
    SubBacia: string;
    CodRio: string;
}

interface ITargetAnaFields {
    CodEstacao: string;
    DataHora: string;
    Vazao: string;
    Nivel: string;
    Chuva: string;
}

class GetDadosHidrometeorologicosByUfService{
    public async execute ({download,target_uf,data_inicio,data_fim}:IRequestDTO) : Promise<any> {

        const getEstacoesTelemetricas = new GetEstacoesTelemetricasService();
        const getDadosHidrometeorologicos = new GetDadosHidrometeorologicosService();

        
        const estacoesTelemetricasResponse = await getEstacoesTelemetricas.execute({
            download:false,
            target_uf,
        });

        //let hidrotelemetria = <ITargetAnaFields[]>[];
        let hidrotelemetria=<ITargetAnaFields[]>[];
        
        const estacoesTelemetricas = <IEstacoesTelemetricas[]>estacoesTelemetricasResponse.estacoesTelemetricas;
        
        for(const item of estacoesTelemetricas){

            console.log(item.CodEstacao)

            const hidrotelemetriaResponse = await getDadosHidrometeorologicos.execute({
                download:false,
                cod_estacao: item.CodEstacao,
                data_inicio,
                data_fim,
            })

            if(hidrotelemetriaResponse.hidroteletremia.length){
                if(!hidrotelemetria.length){
                    hidrotelemetria = hidrotelemetriaResponse.hidroteletremia;
                }else{
                    console.log(hidrotelemetriaResponse.hidroteletremia)
                    hidrotelemetria =  hidrotelemetria.concat(hidrotelemetriaResponse.hidroteletremia)
                }
            }
        
        };

        const responseDTO = <IResponseDTO>{
            hidrotelemetria
        } 

        if(download){
            const fileName = uuid();
            saveJsonAsCsvFile(hidrotelemetria,fileName);
            responseDTO.generatedFileName = `${fileName}.csv`;
        }

        return responseDTO;

    }
}

export default GetDadosHidrometeorologicosByUfService;