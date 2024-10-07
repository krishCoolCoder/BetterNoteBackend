import { base64Encode, decryptData } from "../utility/utility";

let router = require("express").Router();
const zlib = require('zlib');

router.get("/generateNotes", (req,res)=>{
    console.log("The payload is this : ", req.body)
    return new Promise((resolve, reject) => {    
        zlib.gzip(JSON.stringify(req.body), (err, compressedData) => {      
            if (err) {        
                console.error('Error compressing:', err);        
                return reject(err);      
            }      
            console.log("The compressedData is this: ", compressedData);            
            // Step 2: Base64 encode the compressed data      
            const base64Compressed = base64Encode(compressedData);      
            console.log("The base64Compressed data is this: ", base64Compressed);      
            resolve(base64Compressed);    
        });  
    }).then((data)=>{
        res.status(200).send(
            {
                data: data,
                message: "Example data for the notes sharing purpose."
            }
        );
    }).catch(err=>{
        res.status(500).send(
            {
                errorMessage : err,
                message: "Something went wrong."
            }
        )
    })
})

// get the list of the notes.
router.get("/notes", (req, res) => {
    res.status(200).send(
        {
            message: "It is started"
        }
    );
});

// Save the notes.
router.post("/notes", async (req,res)=>{
    console.log("The payload is this : ", req.body)
    let decodedData : string = await decryptData(JSON.stringify(req.body.data))
    console.log("The decoded data is this : ", decodedData)
    res.status(200).send(
        {
            data: JSON.parse(decodedData),
            message: "Saved notes successfully"
        }
    )
})

router.put("/notes", (req,res)=>{
    res.send(200).send(
        {
            message : "Updated notes successfully"
        }
    )
})

router.delete("/delete", (req,res)=>{
    res.send(200).send(
        {
            message : "Deleted notes successfully"
        }
    )
})

module.exports = router;