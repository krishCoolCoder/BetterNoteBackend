let router = require("express").Router();

router.get("/notes", (req, res) => {
    res.status(200).send(
        {
            message: "It is started"
        }
    );
});

router.post("/notes", (req,res)=>{
    res.status(200).send(
        {
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