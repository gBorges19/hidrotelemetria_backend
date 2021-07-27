import axios from 'axios';
import {parseString} from 'xml2js';
import {v4 as uuid} from 'uuid'
import {saveJsonAsCsvFile} from '../utils/csvFilesHandler';

interface IResponseDTO {
    estacoesTelemetricas: {};

}

interface IRequestDTO {
    download: boolean;
    target_uf: string;
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

class GetEstacoesTelemetricasService{
    public async execute ({download,target_uf}:IRequestDTO) : Promise<IResponseDTO> {

        const url = "http://telemetriaws1.ana.gov.br/ServiceANA.asmx/ListaEstacoesTelemetricas?statusEstacoes=&origem=";
        
        const estacoesResponse  = await axios.get(url);

        const options = {
            object: true,
            reversible: false,
            coerce: false,
            sanitize: true,
            trim: true,
            arrayNotation: false,
            alternateTextNode: false
        };
        
        //let estacoesTelemetricas = <IEstacoesTelemetricas[]>[];
        let estacoesTelemetricas = <any>{};

        parseString(estacoesResponse.data, (err, result) => {
            if(err) {
                throw err;
            }
            const json = result;

            const estacoesTelemetricasConverted = json.DataSet["diffgr:diffgram"][0].Estacoes[0].Table;

            //console.log(estacoesTelemetricasConverted);
            
            estacoesTelemetricasConverted.map((item:any)=>{
                if(item["Municipio-UF"]){
                    const uf = item["Municipio-UF"][0].split('-')[(item["Municipio-UF"][0].split('-').length)-1];
                    if(!estacoesTelemetricas[uf]){
                        estacoesTelemetricas[uf]=[]
                    }
    
                    estacoesTelemetricas[uf].push({
                        NomeEstacao: item.NomeEstacao[0],
                        CodEstacao: item.CodEstacao[0],
                        StatusEstacao: item.StatusEstacao[0],
                        MunicipioUF: item["Municipio-UF"][0],
                        Latitude: item.Latitude[0],
                        Longitude: item.Longitude[0],
                        Altitude: item.Altitude[0],
                        Operadora: item.Operadora[0],
                        Responsavel: item.Responsavel[0],
                        Origem: item.Origem[0],
                        Bacia: item.Bacia[0],
                        SubBacia: item.SubBacia[0],
                        CodRio: item.CodRio[0]
                    })
                }
            })
            
        });

        if(target_uf){
            estacoesTelemetricas = estacoesTelemetricas[target_uf.toUpperCase()];
        }

        if(download){
            const fileName = uuid();
            saveJsonAsCsvFile(estacoesTelemetricas,fileName);
            console.log(fileName);
        }
        
        const responseDTO = {
            estacoesTelemetricas
        } 

        return responseDTO;

    }
}

export default GetEstacoesTelemetricasService;