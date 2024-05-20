const {Schema, model} = require("mongoose")

const blogSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    coverImageURL: {
        type: String,
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    }
})

const blogModel = model("blog", blogSchema)

module.exports = blogModel