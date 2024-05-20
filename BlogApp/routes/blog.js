const { Router } = require("express")
const blogModel = require("../models/blog")
const path = require("path")
const multer = require("multer");
const commentModel = require("../models/comment");

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,`../public/uploads/`))
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    }
})
const upload = multer({ storage: storage })

router.get("/add-new", (req, res) => {
    res.render("addBlog", { userPayload: req.userPayload })
})

router.post("/add-new", upload.single("coverImage"), async (req, res) => {
    const blog = await blogModel.create({
        title: req.body.title,
        body: req.body.body,
        createdBy: req.userPayload._id,
        coverImageURL: `/uploads/${req.file.filename}`
    })

    res.redirect(`/blog/read/${blog._id}`)
})

router.get("/read/:id", async (req, res) => {
    const blog = await blogModel.findById(req.params.id).populate("createdBy")
    res.render("readBlog", {
        userPayload: req.userPayload, 
        blog: blog,
        allComments: await commentModel.find({blogId: req.params.id}).populate("createdBy")}
    )
})

router.post("/read/:id", async (req, res) => {
    const comment = await commentModel.create({
        content: req.body.content,
        blogId: req.params.id,
        createdBy: req.userPayload._id
    })

    res.redirect(`/blog/read/${req.params.id}`)
})

module.exports = router