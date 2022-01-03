require("dotenv").config();
const {sendErrorMessage, isLoggedIn, hash, comparePassword, updateUserValues, sendEmail} = require("./functions");
const { generateToken } = require("../config/jwt");
const User = require("../models/user");
const Campaign = require("../models/campaign");
const {generateSecret, isVerified, generateQRCode} = require('./../config/2fa_auth');
const {genOtp, verifyOtp} = require('./../config/otp');
// const jwt = require("jsonwebtoken");
// const { mongo } = require("mongoose");


module.exports.home = (req, res) => {
  return sendErrorMessage(res, 200, "Home Page!");
};


module.exports.signup = async (req, res) => {
  if (isLoggedIn(req) == true) return sendErrorMessage(res, 200, "You are already logged in.");

  const _name = req.body.name;
  const _email = req.body.email;
  const _phone = req.body.phone;
  const _password = req.body.password;  // this should be the encrypted password.

  User.findOne({ email: _email }, async (err, user) => {
    if (err) return sendErrorMessage(res, 200, "Error in finding the user in DB");

    if (!user) {
      const hashPassword = await hash(_password);
      let userObject = {
        name: _name,
        email: _email,
        password: hashPassword,
        phone: _phone,
      };
      User.create(userObject, (err, user) => {
        if (err) return sendErrorMessage(res, 200, "Unable to create a user while signUp!");
        console.log("Sign Up successfully.");
        return res.status(200).send({
          isError: false,
          user: user,
        });
      });
    } else {
      return sendErrorMessage(res, 200, "This email ID is already exist!");
    }
  });
};


module.exports.signin = async (req, res) => {
  if (isLoggedIn(req) == true) return sendErrorMessage(res, 200, "You are already logged in.");

  const _email = req.body.email;
  const _password = req.body.password; // this should be the encrypted password.

  User.findOne({ email: _email }, async (err, user) => {
    if (err) return sendErrorMessage(res, 200, "Error in finding this user from DB");

    if (user) {
      const isSame = await comparePassword(_password, user.password);
      if (isSame == false) {
        return sendErrorMessage(res, 200, "User has entered a wrong password.");
      }
      // Generate access token.
      const accessToken = generateToken(_email);
      // set this access token into cookies.
      res.cookie("token", accessToken);
      console.log("Sign In successfully.");
      return res.status(200).json({
        isError: false,
        user: user,
      });
    } else {
      return sendErrorMessage(res, 200, "This user do not exist!");
    }
  });
};


module.exports.createCampaign = async (req, res) => {
  // User needs to be authenticated to create a campaign.
  if (isLoggedIn(req) == false) return sendErrorMessage(res, 200, "You need to sign in first.");
  console.log("createCampaign: ", req.body);

  const _campaignName = req.body.name;
  const _campaignDesc = req.body.description;
  const _campaignMinAmount = req.body.minAmount;
  const _campaignTargetAmount = req.body.targetAmount;
  const _campaignAddress = req.body.campaignAddress;
  const _contractFactoryAddress = req.body.contractFactoryAddress;
  const _managerEmail = req.body.manager;

  Campaign.findOne({ campaignAddress: _campaignAddress }, async (err, campaign) => {
      if (err) return sendErrorMessage(res, 200, "Error while finding this camapign from DB");

      if (!campaign) {
        let campaignObject = {
          manager: _managerEmail,
          name: _campaignName,
          description: _campaignDesc,
          minAmount: _campaignMinAmount,
          targetAmount: _campaignTargetAmount,
          campaignAddress: _campaignAddress,
          contractFactoryAddress: _contractFactoryAddress,
        };
        Campaign.create(campaignObject, async (err, campaign) => {
          if (err) return sendErrorMessage(res, 200, "Error while creating a campaign.");

          // find the user from the DB and put this campaign into this user campaign list too.
          User.findOne({ email: _managerEmail }, async (err, user) => {
            if (err) return sendErrorMessage(res, 200, "Error in finding the user from the DB.");

            await user.myCreatedCampaigns.push(campaign);
            await user.save();

            return res.status(200).send({
              isError: false,
              message: "Campaign Created Successfully.",
            });
          });
        });
      } else {
        return sendErrorMessage(res, 200, "This campaign already exist!");
      }
    }
  );
};


module.exports.getUser = (req, res) => {
  if (isLoggedIn(req) == false) return sendErrorMessage(res, 200, "You need to sign in first.");

  const _email = req.body.email;

  User.findOne({ email: _email }, (err, user) => {
    if (err) return sendErrorMessage(res, 200, "Error in finding the user from the DB.");

    return res.status(200).send({
      isError: false,
      user: user,
    });
  });
};


module.exports.updateUser = async (req, res) => {
  const _email = req.body.email;
  const _user = req.body.user;

  User.findOne({ email: _email }, async (err, user) => {
    if (err) return sendErrorMessage(res, 200, "Error in finding the user from the DB.");

    user = updateUserValues(user, _user);
    await user.save();
    
    return res.status(200).send({
      isError: false,
      message: `User details updated with email ID ${_email}.`,
    });
  });
};


module.exports.logout = (req, res) => {
  if (isLoggedIn(req) == false) return sendErrorMessage(res, 200, "You are already logged out.");

  const _email = req.body.email;
  res.clearCookie("token");

  return res.status(200).send({
    isError: false,
  });
};


module.exports.activeCampaigns = (req, res) => {
  if (isLoggedIn(req) == false) return sendErrorMessage(res, 200, "You need to sign in first.");

  Campaign.find({}, (err, allActiveCampaigns) => {
    if (err) return sendErrorMessage(res, 200, "Error in finding all campaigns from the DB.");

    return res.status(200).send({
      isError: false,
      allActiveCampaigns: allActiveCampaigns,
    });
  });
};


module.exports.myCampaigns = (req, res) =>{
  if (isLoggedIn(req) == false) return sendErrorMessage(res, 200, "You need to sign in first.");

  const _email = req.body.email;

  Campaign.find({manager: _email}, (err, allMyCampaigns) => {
    if (err) return sendErrorMessage(res, 200, "Error in finding all my campaigns from the DB.");

    return res.status(200).send({
      isError: false,
      allMyCampaigns: allMyCampaigns,
    });
  });
} 


module.exports.myContributedCampaigns = (req, res) => {
  if (isLoggedIn(req) == false) return sendErrorMessage(res, 200, "You need to sign in first.");

  const _email = req.body.email;

  User.findOne({email: _email}, (err, user) => {
    if (err) return sendErrorMessage(res, 200, "Error in finding the user from the DB.");

    return res.status(200).send({
      isError: false,
      myContributedCampaigns: user.myContributedCampaigns,
    });
  });
}



module.exports.verifyEmail = async (req, res) => {
  if (isLoggedIn(req) == true) return sendErrorMessage(res, 200, "You are already logged in.");

  const _email = req.query.email;
  const _otp = req.query.otp;

  // check if this user is already verified or not from the DB?
  User.findOne({email:_email}, async (err, user) => {
    if (err) return sendErrorMessage(res, 200, "Error while finding the user from the DB.");

    if (user) {
      if (user.isVerified == true) return sendErrorMessage(res, 200, "This user is already verified.");

      let isOtpCorrect = await verifyOtp(_otp, email);
      if (isOtpCorrect == true) {
        // redirect this user to authy page.
      } else {
        // user has clicked the button very late.
        // again send the another otp, and say this in alert that an another otp has been transfered to their account.
      }
    } else {
        return sendErrorMessage(res, 200, "This user do not exist.");
    }
  })
  
}


module.exports.verifyAuthyOtp = (req, res) => {

}


module.exports.contactus = async (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const msg = req.body.msg;

  let isEmailSent = await sendEmail(name, email, phone, msg);
  if (isEmailSent == true) {
    return res.status(200).send({
      isError: false,
    });
  } else {
    return res.status(200).send({
      isError: true,
      message: isEmailSent
    });
  }
}
