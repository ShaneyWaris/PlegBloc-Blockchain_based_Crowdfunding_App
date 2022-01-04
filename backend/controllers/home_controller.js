require("dotenv").config();
const {sendErrorMessage, isLoggedIn, hash, comparePassword, updateUserValues, sendEmail, sendOTPEmail} = require("./functions");
const { generateToken } = require("../config/jwt");
const User = require("../models/user");
const Campaign = require("../models/campaign");
const {generateSecret, isVerified, generateQRCode} = require('./../config/2fa_auth');
const {genOtp, verifyOtp} = require('./../config/otp');


// This is the home page for backend.
module.exports.home = (req, res) => {
  return sendErrorMessage(res, 200, "Home Page!");
};


// Sign Up controller.
module.exports.signup = async (req, res) => {
  if (isLoggedIn(req) == true) return sendErrorMessage(res, 200, "You are already logged in.");

  const _name = req.body.name;
  const _username = req.body.username;
  const _email = req.body.email;
  const _phone = req.body.phone;
  const _password = req.body.password;  // this should be the encrypted password.
  const _myCampaignFactoryAddress = req.body.myCampaignFactoryAddress;

  User.findOne({ email: _email }, async (err, user) => {
    if (err) return sendErrorMessage(res, 200, "Error in finding the user in DB");

    if (!user) {
      const hashPassword = await hash(_password);
      let userObject = {
        name: _name,
        username: _username,
        email: _email,
        password: hashPassword,
        phone: _phone,
        myCampaignFactoryAddress: _myCampaignFactoryAddress
      };

      User.create(userObject, async (err, user) => {
        if (err) return sendErrorMessage(res, 200, "Unable to create a user while signUp!");
        console.log("Sign Up successfully.");

        // Now first send the mail to user for an OTP.
        let otp = await genOtp(_email);
        await sendOTPEmail(_name, _email, otp);

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


// Sign In controller.
module.exports.signin = async (req, res) => {
  if (isLoggedIn(req) == true) return sendErrorMessage(res, 200, "You are already logged in.");

  const _email = req.body.email;
  const _password = req.body.password; // this should be the encrypted password.
  const _otp = req.body.otp;

  User.findOne({ email: _email }, async (err, user) => {
    if (err) return sendErrorMessage(res, 200, "Error in finding this user from DB");

    if (user) {
      const isSame = await comparePassword(_password, user.password);
      if (isSame == false) {
        return sendErrorMessage(res, 200, "User has entered a wrong password.");
      }

      // check if user is verified or not.
      if (user.isVerified == false) {
        // send otp again.
        let newOtp = await genOtp(_email);
        await sendOTPEmail(user.name, _email, newOtp);
        return sendErrorMessage(res, 200, "You need to verify your email ID first.");
      }

      let secret = user.secret;
      let isAuthyCorrect = isVerified(secret.ascii, "ascii", parseInt(_otp));

      if (isAuthyCorrect == true) {
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
        return sendErrorMessage(res, 200, "User has entered a wrong OTP.");
      }
    } else {
      return sendErrorMessage(res, 200, "This user do not exist!");
    }
  });
};


// Create campaign controller.
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


// get User object from the given email ID.
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


// update user profile details.
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


// Logout from the account.
module.exports.logout = (req, res) => {
  if (isLoggedIn(req) == false) return sendErrorMessage(res, 200, "You are already logged out.");

  const _email = req.body.email;
  res.clearCookie("token");

  return res.status(200).send({
    isError: false,
  });
};


// send a list of all active campaigns.
module.exports.activeCampaigns = (req, res) => {
  if (isLoggedIn(req) == false) return sendErrorMessage(res, 200, "You need to sign in first.");

  Campaign.find({}, (err, allActiveCampaigns) => {
    if (err) return sendErrorMessage(res, 200, "Error in finding all campaigns from the DB.");

    // TODO: send only those campaigns whose isActive = true.

    return res.status(200).send({
      isError: false,
      allActiveCampaigns: allActiveCampaigns,
    });
  });
};


// get all the campaigns created by a user.
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


// get all the campaigns where user has contributed some amount.
module.exports.myContributedCampaigns = (req, res) => {
  if (isLoggedIn(req) == false) return sendErrorMessage(res, 200, "You need to sign in first.");

  const _email = req.body.email;

  User.findOne({email: _email}, (err, user) => {
    if (err) return sendErrorMessage(res, 200, "Error in finding the user from the DB.");

    if (user) {
      return res.status(200).send({
        isError: false,
        myContributedCampaigns: user.myContributedCampaigns,
      });
    } else {
      return sendErrorMessage(res, 200, "This user do not exist.");
    }
  });
}


// verify the email ID of a user.
module.exports.verifyEmail = async (req, res) => {
  if (isLoggedIn(req) == true) return sendErrorMessage(res, 200, "You are already logged in.");

  const _email = req.body.email;
  const _otp = req.body.otp;

  // check if this user is already verified or not from the DB?
  User.findOne({email:_email}, async (err, user) => {
    if (err) return sendErrorMessage(res, 200, "Error while finding the user from the DB.");

    if (user) {
      if (user.isVerified == true) return sendErrorMessage(res, 200, "This user is already verified.");

      let isOtpCorrect = await verifyOtp(_otp, _email);
      if (isOtpCorrect == true) {
        // generate qr-code and send it to my user.
        const secret = generateSecret();
        const qrcode = await generateQRCode(secret);

        user.isVerified = true;
        user.secret = secret;
        await user.save();

        res.status(200).send({
          isError: false,
          qr_code: qrcode
        });
      } else {
        // send an otp again.
        let newOtp = await genOtp(_email);
        await sendOTPEmail(user.name, _email, newOtp);
        // user has clicked the link after 2 minutes.
        // again send the another otp, and say this in alert that an another otp has been transfered to their account.
        return sendErrorMessage(res, 200, "Verification link has expired, we have sent an another OTP on your Email. You have only 2 minutes to verify your Email ID.");
      }
    } else {
        return sendErrorMessage(res, 200, "This user do not exist.");
    }
  })  
}


// Contact Us.
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


// verify authy OTP.
module.exports.verifyAuthyOtp = (req, res) => {
  if (isLoggedIn(req) == true) return sendErrorMessage(res, 200, "You are already logged in.");

  const _email = req.body.email;
  const _otp = req.body.otp;

  User.findOne({email:_email}, async (err, user) => {
    if (err) return sendErrorMessage(res, 200, "Error while finding the user from the DB.");

    if (user) {
      if (user.isVerified == false) return sendErrorMessage(res, 200, "You need to verify your email ID first.");

      let secret = user.secret;
      let isAuthyCorrect = isVerified(secret.ascii, "ascii", parseInt(_otp));

      if (isAuthyCorrect == true) {
        return res.status(200).send({
          isError: false
        });
      } else {
        return sendErrorMessage(res, 200, "User has entered a wrong OTP.");
      }
    } else {
      return sendErrorMessage(res, 200, "This user do not exist.")
    }
  })
}


// Forgot Password.
module.exports.forgotPassword = (req, res) => {
  if (isLoggedIn(req) == true) return sendErrorMessage(res, 200, "You are already logged in.");

  const _email = req.body.email;
  const _otp = req.body.otp;

  // check if this user is already verified or not from the DB?
  User.findOne({email:_email}, async (err, user) => {
    if (err) return sendErrorMessage(res, 200, "Error while finding the user from the DB.");

    if (user) {
      let secret = user.secret;
      let isAuthyCorrect = isVerified(secret.ascii, "ascii", parseInt(_otp));

      if (isAuthyCorrect == true) {
        return res.status(200).send({
          isError: false
        });
      } else {
        return sendErrorMessage(res, 200, "User has entered a wrong OTP.");
      }
    } else {
      return sendErrorMessage(res, 200, "User with this email ID do not exist.");
    }
  });
}


// Update Password of a user.
module.exports.updatePassword = async (req, res) => {
  if (isLoggedIn(req) == true) return sendErrorMessage(res, 200, "You are already logged in.");

  const _email = req.body.email;
  const _newPassword = req.body.password;

  User.findOne({email:_email}, async (err, user) => {
    if (err) return sendErrorMessage(res, 200, "Error while finding the user from the DB.");

    if (user) {
      const hashPassword = await hash(_newPassword);
      user.password = hashPassword;
      await user.save();
      return res.status(200).send({
        isError: false
      });
    } else {
      return sendErrorMessage(res, 200, "This user do not exist.")
    }
  });  
}