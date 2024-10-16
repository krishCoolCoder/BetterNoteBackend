import { base64Encode, decryptData } from "../utility/utility";

let router = require("express").Router();
const zlib = require('zlib');

let mongoose = require("mongoose")
let User = require("../models/user");

// get the list of the notes.
router.get("/", async (req, res) => {
    if (!req.query?.userId) {
        return req.status(500).send(
            {
                message : "UserId value is not passed."
            }
        )
    };

    let existingUserData = await User.findOne(
        {
            _id : mongoose.Types.ObjectId.createFromHexString(req.query?.userId)
        }
    );

    if (existingUserData) {
        return res.status(200).send(
            {
                data : existingUserData,
                message: "Successfully fetched the user's data."
            }
        )
    } else {
        return res.status(500).send(
            {
                message : "Something went wrong."
            }
        )
    }
    
});

// Save the notes.
router.post("/", async (req,res)=>{
    if (!req.body.hasOwnProperty("firstName")) {
        return req.status(500).send(
            {
                message : "firstName is mandatory"
            }
        )
    }
    if (!req.body.hasOwnProperty("userName")) {
        return req.status(500).send(
            {
                message : "firstName is mandatory"
            }
        )
    }
    if (!req.body.hasOwnProperty("email")) {
        return req.status(500).send(
            {
                message : "firstName is mandatory"
            }
        )
    }
    let existingUserData = await User.findOne(
        {
            userName : req?.body?.userName,
            email : req.body?.email
        }
    )
    if (existingUserData) {
        return res.status(500).send(
            {
                message : "User already exist with userName or email"
            }
        )
    }
    let userData = await new User(
        {
            firstName : req.body?.firstName,
            middleName : req.body?.middleName,
            lastName : req.body?.lastName,
            userName : req.body?.userName,
            email : req.body?.email,
            age : req.body?.age,
            passwored : req.body?.password || "superAdmin"
        }).save();
    if (userData){
        console.log("The result of the user save is this : ", userData)
        return res.status(200).send(
            {
                data : userData,
                message: "Saved user successfully"
            }
        )
    } else {
        return res.status(500).send(
            {
                message : "Something went wrong."
            }
        )
    }
})

router.put("/", async (req,res)=>{
    // validations : 
    let expectedPayloadProperties = {
        firstName : "firstName",
        middleName : "middleName",
        lastName : "lastName",
        userName : "userName",
        age : "age",
        email : "email",
        password : "password"
    }
    let updatedUser  = await User.findOneAndUpdate(
        {
            _id : mongoose.Types.ObjectId.createFromHexString(req.body?.userId)
        },
        {
            ...req.body, 
            updatedAt : new Date()
        },
        {new : true}
    )
    console.log("the updatedUser is this : ", updatedUser)
    if (updatedUser){
        return res.status(200).send(
            {
                data : updatedUser,
                message : "Updated user successfully"
            }
        )
    } else {
        return res.status(500).send(
            {
                message : "Something went wrong."
            }
        )
    }
})

router.delete("/", async (req,res)=>{
    if ( !req.query.userId ) {
        return res.status(500).send(
            {
                message: "userId is missing"
            }
        )
    };
    let existingUserData = await User.findOne(
        {
            _id : mongoose.Types.ObjectId.createFromHexString(req.query?.userId)
        }
    )
    if ( !existingUserData ) {
        return res.status(500).send(
            {
                message: "User doesn't exist"
            }
        )
    };
    let deletedUser = await User.findOneAndDelete(
        {
            _id : mongoose.Types.ObjectId.createFromHexString(req.query?.userId)
        }
    )
    if (deletedUser) {
        return res.status(200).send(
            {
                data : deletedUser,
                message : "Deleted user successfully"
            }
        )
    } else {
        return res.status(200).send(
            {
                message : "Something went wrong."
            }
        )        
    }
})

module.exports = router;