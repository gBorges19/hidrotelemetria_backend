import axios from 'axios';
import {parseString} from 'xml2js';
import {saveJsonAsCsvFile} from '../utils/csvFilesHandler';

interface IResponseDTO {
    hidroteletremia: ITargetAnaFields[];
}

interface IRequestDTO {
    download: boolean;
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

class GetDadosHidrometeorologicosService{
    public async execute ({download,cod_estacao,data_inicio,data_fim}:IRequestDTO): Promise<IResponseDTO> {
        
        //console.log(cod_estacao,data_inicio,data_fim);
        const telemetriaAnaResponse = await axios.get('http://telemetriaws1.ana.gov.br/ServiceANA.asmx/DadosHidrometeorologicos',{
            params:{
                codEstacao: cod_estacao,
                dataInicio: data_inicio,
                dataFim: data_fim,
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
        
        let dadosHidrometeorologicosFromJson = <any>[];
        parseString(telemetriaAnaResponse.data, (err, result) => {
            if(err) {
                throw err;
            }

            // `result` is a JavaScript object
            const json = result;
            // convert it to a JSON string
        
            // log JSON string
            dadosHidrometeorologicosFromJson = json.DataTable["diffgr:diffgram"][0].DocumentElement[0].DadosHidrometereologicos;
        });

        const hidroteletremia = <ITargetAnaFields[]>[];
        
        if(dadosHidrometeorologicosFromJson){
            dadosHidrometeorologicosFromJson.forEach(({CodEstacao,DataHora,Chuva,Nivel,Vazao}:ITargetAnaFields)=>{

                hidroteletremia.push({
                    CodEstacao:CodEstacao[0],
                    DataHora:DataHora[0],
                    Chuva:Chuva[0],
                    Nivel:Nivel[0],
                    Vazao:Vazao[0]
                });
    
            });
        }

        const responseDTO = {
            hidroteletremia,
        } 

        return responseDTO;

    }
}

export default GetDadosHidrometeorologicosService;