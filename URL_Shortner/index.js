const express = require("express")
const mongoose = require("mongoose")
const sid = require("shortid")
const path = require("path")

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
    },
    noClicks: {
        type: Number
    }
})    
const URLmodel = mongoose.model("url", urlSchema)

// Express
const app = express()


// Set view engine of express
app.set("views", path.join(__dirname, "views"))
app.set('view engine', 'ejs')


// Middlewares
app.use(express.json()) // To Support JSON Data
app.use(express.urlencoded({ extended: false })) // To Support FORM Data

// Routes
app.get("/url", async (req, res) => {
    const allUrl = await URLmodel.find()
    
    return res.render("home", {allUrl: allUrl})
})

app.post("/url", async (req, res) => {
    const body = req.body;
    if(!body){
        return res.status(400).json({"status": "Enter the URL"})
    }
    const checkURL = await URLmodel.findOne({originalURL: body.url})
    if(checkURL){
       return res.render("home", {"shortURLcode": checkURL.shortURLcode}) 
    }

    const shortID = sid.generate()
    await URLmodel.create({
        originalURL: body.url,
        shortURLcode: shortID,
        noClicks: 0
    })

    return res.render("home", {"shortURLcode": shortID})
})

app.get("/url/:shortID", async (req, res) => {
    const shortID = req.params.shortID;
    const urlObj = await URLmodel.findOne({ shortURLcode: shortID})

    if(!urlObj){
        return res.json({"status": "No such URL Exists"})
    }

    

    res.redirect(urlObj.originalURL)
})

app.listen(8080, () => console.log("Server Started at PORT 8080!"))
