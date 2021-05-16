import axios from 'axios';
import {toJson,JsonOptions} from 'xml2json';

interface IResponseDTO {
    hidroteletremia: ITargetAnaFields[];
}

interface IRequestDTO {
    cod_estacao: string;
    data_inicio: string;
    data_fim: string;
}

interface ITargetAnaFields {
    CodEstacao: string;
    DataHora: string;
    Vazao: string;
    Nivel: string;
    Chuva: string;
}

class GetTelemetriaAnaService{
    public async execute ({cod_estacao,data_inicio,data_fim}:IRequestDTO): Promise<IResponseDTO> {

        const telemetriaAnaResponse = await axios.get('http://telemetriaws1.ana.gov.br/ServiceANA.asmx/DadosHidrometeorologicos',{
            params:{
                codEstacao: cod_estacao,
                dataInicio: data_inicio,
                dataFim:data_fim,
            }
        })
        
        const options = {
            object: true,
            reversible: false,
            coerce: false,
            sanitize: true,
            trim: true,
            arrayNotation: false,
            alternateTextNode: false
        };
        
        const telemetriaAnaResponseJson = toJson(telemetriaAnaResponse.data,options);

        const dadosHidrometeorologicosFromJson = telemetriaAnaResponseJson.DataTable["diffgr:diffgram"].DocumentElement.DadosHidrometereologicos;

        //console.log(dadosHidrometeorologicos);        

        const hidroteletremia = <ITargetAnaFields[]>[];
        
        dadosHidrometeorologicosFromJson.forEach(({CodEstacao,DataHora,Chuva,Nivel,Vazao}:ITargetAnaFields)=>{

            hidroteletremia.push({
                CodEstacao,
                DataHora,
                Chuva,
                Nivel,
                Vazao
            });

        });

        console.log(hidroteletremia);

        const responseDTO = {
            hidroteletremia
        } 

        return responseDTO;

    }
}

export default GetTelemetriaAnaService;