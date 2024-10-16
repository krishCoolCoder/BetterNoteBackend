import mongoose from "mongoose";
import { base64Encode, decryptData } from "../utility/utility";

let router = require("express").Router();
const zlib = require('zlib');
// import {NoteSchema} from "../models/notes"
let Note = require("../models/notes");

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
router.get("/all", async (req, res) => {
    let allNotes = await Note.find({})
    if (allNotes.length != 0) {
        res.status(200).send(
            {
                data : allNotes,
                message: "Successfully fetched the notes list"
            }
        );
    } else {
        return res.status(500).send(
            {
                message : "Something went wrong"
            }
        )
    }
});

// Save the notes.
router.post("/", async (req,res)=>{
    let decodedData : any = decryptData(req.body?.data);
    let notesData = await new Note(
        {
            title : decodedData?.title,
            body : decodedData?.body
        }
    ).save();
    console.log("The notes is this : ", notesData)
    if (notesData){
        return res.status(200).send(
            {
                data: notesData,
                message: "Saved notes successfully"
            }
        )
    } else {
        return res.status(500).sent(
            {
                message : "Something went wrong."
            }
        )
    }
})

router.put("/",async (req,res)=>{
    // console.log("The payload is this : ", req.body)
    // let decodedData : any = await decryptData(JSON.stringify(req.body.data))
    // console.log("The decoded data is this : ", decodedData, " and the type of is this : ", typeof decodedData);
    // decodedData = JSON.parse(decodedData);
    // console.log("The decoded data is this : ", decodedData.title," and the body is this : ", decodedData.body, " and the type of is this : ", typeof decodedData);
    req.body = await decryptData(req.body.data);
    if ( !req.body?.noteId ) {
        return res.status(500).send(
            {
                message : "noteId is not sent."
            }
        )
    }
    let updatedNote = await Note.findOneAndUpdate(
        {
            _id : mongoose.Types.ObjectId.createFromHexString(req.body?.noteId)
        },
        {
            ...req.body
        }, 
        {
            new :true
        }
    );
    if (updatedNote) {
        return res.status(200).send(
            {
                data : updatedNote,
                message : "Updated notes successfully"
            }
        )
    } else {
        return res.status(500).send(
            {
                message : "Something went wrong"
            }
        )
    }
})

router.delete("/", async (req,res)=>{
    let decryptedData : any= await decryptData(req.body?.data);
    let existingNote = await Note.findOne({_id : mongoose.Types.ObjectId.createFromHexString(decryptedData?.noteId)});
    console.log("The existingNote is this : ", decryptedData, " and the typeof is : ", typeof decryptedData)
    if (!existingNote) {
        return res.status(500).send(
            {
                message : "Note does not exist"
            }
        )
    }
    let deletedData = await Note.findOneAndDelete(
        {
            _id : mongoose.Types.ObjectId.createFromHexString(decryptedData?.noteId)
        }
    )
    if (deletedData) {
        return res.status(200).send(
            {
                data : deletedData,
                message : "Deleted notes successfully"
            }
        )
    } else {
        return res.status(200).send(
            {
                message : "Something went wrong"
            }
        )
    }
})

module.exports = router;