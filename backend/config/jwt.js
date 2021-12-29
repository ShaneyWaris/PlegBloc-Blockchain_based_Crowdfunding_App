require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.generateToken = (_email) => {
    // payload.
    const user = {
        email: _email
    };
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWTtokenExpiryTime,
    });
};