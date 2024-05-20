const mongoose = require("mongoose");
const {createHmac, randomBytes} = require("crypto")

const userSchema = new mongoose.Schema({
    profileImageURL: {
        type: String,
        default: "/userImages/default.png"
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "USER"
    }
})

// Before Saving the Password
userSchema.pre("save", function(next){
    const currentUser = this;

    if(!currentUser.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
                                .update(currentUser.password)
                                .digest("hex"); 

    currentUser.salt = salt;
    currentUser.password = hashedPassword;

    next();
})

// Model
const userModel = mongoose.model("user", userSchema)

module.exports = userModel