const {verifyToken} = require("../services/authentication")

function checkForAuthenticationToken(req, res, next){
    if(!req.cookies.token){
        return next();
    }

    try {
        const userPayload = verifyToken(req.cookies.token)
        req.userPayload = userPayload
    } catch (err) {}
    return next();
}

module.exports = {
    checkForAuthenticationToken
}