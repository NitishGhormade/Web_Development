const express = require("express");
const fs = require("fs");

const app = express();

app.get("/", (req, res) => {
    const fileName = req.query.file;
    
    fs.readFile(`./${fileName}`, "utf-8", (err, data) => {
        if(err){
            return res.send("Error: " + err);
        }
        return res.send("Data: " + data);
    });
});

app.listen(8080, () => { console.log("Server Started!"); });
