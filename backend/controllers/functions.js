require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// To show an error message on the UI.
function sendErrorMessage(res, statusCode, message) {
    console.log("Error Message = ", message);
    return res.status(statusCode).send({
        'isError': true,
        'message': message
    });
};


// To check if user is logged in or not.
function isLoggedIn(req) {
    if (typeof req.cookies.token == "undefined") {
        console.log("Token is not present in the cookies.");
        return false;
    } else {
        try {
            const payload = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
            return true;
        } catch (err) {
            console.log(err);
            console.log("Token is present in the cookies but not verifying correctly.");
            return false;
        }
    }
}


// Hash the password.
async function hash(password) {
    const saltRounds = 10;
    let salt = await bcrypt.genSalt(saltRounds);
    let hash = await bcrypt.hash(password, salt);
    return hash;
}


// Verify the hashed password.
async function comparePassword(password, hash) {
    try {
        let ans = await bcrypt.compare(password, hash);
        if (ans) {
            console.log("Password is Correct.");
            return true;
        }
        console.log("Password is Incorrect.");
        return false;
    } catch (e) {
        return false;
    }
}


// async function func() {
    // console.log("\n")
    // let hashPassword = await hash("Pass");
    // console.log(hashPassword)
    // console.log("\n")
    // let cp = await comparePassword("Pass", hashPassword);
    // // console.log(cp)

    // console.log("\n")
    // let frontend_hashPassword = await hash("Pass");
    // console.log(frontend_hashPassword)

    // console.log("\n")
    // let db_hashPassword = await hash(frontend_hashPassword);
    // console.log(db_hashPassword)

    // console.log("\n")
    // let cp = await comparePassword("Pass", db_hashPassword);
    // console.log(cp)

    
    // console.log("\n")
    // let frontend_hashPassword = await hash("Pass");
    // console.log(frontend_hashPassword)

    // console.log("\n")
    // let cp = await comparePassword("Pass", frontend_hashPassword);
    // console.log(cp)

    // console.log("\n")
    // let frontend_hashPassword1 = await hash("Pass");
    // console.log(frontend_hashPassword1)

    // console.log("\n")
    // let cp1 = await comparePassword("Pass", frontend_hashPassword1);
    // console.log(cp1)
// }
// func();


// update user.
function updateUserValues(mongoUser, newUser) {
    mongoUser.name = newUser.name;
    mongoUser.username = newUser.username;
    mongoUser.email = newUser.email;
    mongoUser.phone = newUser.phone;
    mongoUser.myCampaignFactoryAddress = newUser.myCampaignFactoryAddress;
    mongoUser.myCreatedCampaigns = newUser.myCreatedCampaigns;
    mongoUser.myContributedCampaigns = newUser.myContributedCampaigns;
    
    return mongoUser;
}

module.exports = {
    sendErrorMessage,
    isLoggedIn,
    hash,
    comparePassword,
    updateUserValues
}