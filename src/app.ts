import express from 'express';
const app = express();
const bodyParser = require('body-parser');
import {connectDB}from "./mongodbConnection";
app.use(bodyParser.json({ limit: '1mb' }));

app.use("/", require("./notes/notesController"))
app.use("/user", require("./users/UserController"))

app.listen(8080, ()=> {
    connectDB();
    console.log("Server is up on port : 8080.")
})