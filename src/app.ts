import express from 'express';
const app = express();

app.use("/", require("./notes/notesController"))

app.listen(8080, ()=> {
    console.log("Server is up on port : 8080.")
})