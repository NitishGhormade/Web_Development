const express = require("express");
const mongoose = require("mongoose")
const path = require("path");
const cookieParser = require("cookie-parser")
const {checkForAuthenticationToken} = require("./middlewares/authentication")
const userRoute = require("./routes/user")
const blogRoute = require("./routes/blog")
const blogModel = require("./models/blog")

// Connect
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connected!"))


// App
const app = express();
const PORT = process.env.PORT || 8080;

// View Engine and Views
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Middlewares
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(checkForAuthenticationToken)
app.use(express.static(path.join(__dirname, "public")))


// Routes
app.get("/", async (req, res) => {
    res.render("home", {userPayload: req.userPayload, allBlogs: await blogModel.find()})
})

app.use("/user", userRoute)
app.use("/blog", blogRoute)


// Server Start
app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}!`))