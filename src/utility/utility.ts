const zlib = require('zlib');

export function base64Decode(data) {
    return Buffer.from(data, 'base64');
}
export function base64Encode(data) {
    return Buffer.from(data).toString('base64');
}

export function decryptData(data: string) : Promise<string> {
    // // Step 1: Base64 decode the received data
    // const decodedData = base64Decode(data);
    // console.log("DecodedData is this : ", decodedData)

    // // Step 2: Decompress the gzip data
    // zlib.gunzip(decodedData, (err, decompressedData) => {
    //     if (err) {
    //         console.log("Error during compression : ", err)
    //         return err;
    //     }
    //     console.log("The decompressedData is this : ", decompressedData)
    //     // Respond with the decoded note content
    //     return decompressedData.toString();
    // });

    return new Promise((resolve, reject) => {    
        const decodedData = base64Decode(data);
        zlib.gunzip(decodedData, 
            (err, compressedData) => {      
                if (err) {        
                    console.error('Error compressing:', err);        
                    return reject(err);      
                }      
                console.log("The compressedData is this: ", compressedData);            
                // Step 2: Base64 encode the compressed data      
                // const base64Compressed = base64Encode(compressedData);      
                console.log("The base64Compressed data is this: ", compressedData.toString());      
                resolve(compressedData.toString());    
            });  
        });
}