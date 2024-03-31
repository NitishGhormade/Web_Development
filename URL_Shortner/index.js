const express = require("express")
const mongoose = require("mongoose")
const sid = require("shortid")

// Connection 
mongoose
    .connect("mongodb://127.0.0.1:27017/url-shortner")
    .then(() => console.log("MongoDB Connected!"))

// MongoDB
const urlSchema = new mongoose.Schema({
    originalURL: {
        type: String,
        required: true
    },
    shortURLcode: {
        type: String,
        required: true,
        unique: true
    }
})    
const URLmodel = mongoose.model("url", urlSchema)

// Express
const app = express()

// Middlewares
app.use(express.json())

// Routes
app.post("/url", async (req, res) => {
    const body = req.body;
    if(!body){
        return res.status(400).json({"status": "Enter the URL"})
    }

    const checkURL = await URLmodel.findOne({originalURL: body.url})
    if(checkURL){
       return res.json({"status": `URL Already Exists having Code: ${checkURL.shortURLcode}`}) 
    }

    const shortID = sid.generate()
    await URLmodel.create({
        originalURL: body.url,
        shortURLcode: shortID
    })

    return res.json({"status": `Short URL Code: ${shortID}`})
})

app.get("/:shortID", async (req, res) => {
    const shortID = req.params.shortID;
    const urlObj = await URLmodel.findOne({ shortURLcode: shortID})

    res.redirect(urlObj.originalURL)
})


app.listen(8080, () => console.log("Server Started!"))