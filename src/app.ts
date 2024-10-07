import express from 'express';
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '1mb' }));

app.use("/", require("./notes/notesController"))

app.listen(8080, ()=> {
    console.log("Server is up on port : 8080.")
})