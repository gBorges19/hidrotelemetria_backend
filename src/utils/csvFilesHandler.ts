import {json2csvAsync} from 'json-2-csv';

import * as fs from 'fs';

export const saveJsonAsCsvFile = async (obj: any, filename: string) => {

    await json2csvAsync(obj).then(csv => {

        // print CSV string
        //console.log(csv);
    
        // write CSV to a file
        fs.writeFileSync(`./src/temp/${filename}.csv`, csv);
    
    }).catch(err => console.log(err));
}

export const deleteCsvFile = async (filename: string) =>{
    fs.unlinkSync(filename);
}

