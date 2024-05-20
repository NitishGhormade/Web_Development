const jwt = require("jsonwebtoken")

const secretKey = "Nitish@1234"

function createTokenForUser(user){
    const payload = {
        _id: user._id,
        profilImageURL: user.profilImageURL,
        username: user.username,
        email: user.email,
        role: user.role
    }
    
    const token = jwt.sign(payload, secretKey)
    return token;
}

function verifyToken(token){
    const payload = jwt.verify(token, secretKey) // If the token is invalid, it will throw an error so apply (((TRY CATCH in the LOGIN ROUTE)))
    return payload;
    
}

module.exports = {
    createTokenForUser,
    verifyToken
}