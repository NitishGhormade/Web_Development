const userModel = require("../models/user")
const {createTokenForUser} = require("../services/authentication")
const {createHmac} = require("crypto")
const {Router} = require("express")
const path = require("path")
const multer = require("multer")

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,`../public/userImages/`))
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    }
})
const upload = multer({ storage: storage })

router.get("/signup", (req, res) => {
    res.render("signup", {userPayload: req.userPayload})
})

router.get("/login", (req, res) => {
    res.render("login", {userPayload: req.userPayload})
})

router.post("/signup", upload.single("profileImageURL"), async (req, res) => {
    const {username, email, password} = req.body

    const user = await userModel.create({
        profileImageURL: req.file === undefined ? "/userImages/default.png" : `/userImages/${req.file.filename}`,
        username: username,
        email: email,
        password: password
    })

    const token = createTokenForUser(user);
    res.cookie("token", token)

    res.redirect("/")
})

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await userModel.findOne({"email": email})
    
        if(!user) throw new Error("User Not Found!");
    
        const newHashPass = createHmac("sha256", user.salt)
                                    .update(password)
                                    .digest("hex")
    
        if(newHashPass !== user.password) throw new Error("Incorrect Password!");
    
        const token = createTokenForUser(user);
    
        res.cookie("token", token)
        return res.redirect("/")
    } 
    catch (err) {
        return res.render("login", {error: "Invalid Email or Password!"})
    }
})

router.get("/logout", (req, res) => {
    res.clearCookie("token")
    return res.redirect("/")
})

module.exports = router