require("dotenv").config();
const {sendErrorMessage, isLoggedIn, hash, comparePassword, updateUserValues, sendEmail, sendOTPEmail} = require("./functions");
const {generateSecret, isVerified, generateQRCode} = require('./../config/2fa_auth');
const {genOtp, verifyOtp, encrypt, decrypt} = require('./../config/otp');
const { generateToken } = require("../config/jwt");
const User = require("../models/user");
const Campaign = require("../models/campaign");


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
      return sendErrorMessage(res, 200, "This user is already exist.");
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
        return sendErrorMessage(res, 200, "You need to verify your email ID first. We have sent a link to your email. You have only 2 minutes to verify your email ID.");
      }

      await decrypt(user.secret).then((secret) => {
        let isAuthyCorrect = isVerified(secret, "ascii", parseInt(_otp));

        if (isAuthyCorrect == true) {
          const accessToken = generateToken(_email);  // Generate access token.
          res.cookie("token", accessToken);  // set this access token into cookies.
          console.log("Sign In successfully.");
          return res.status(200).json({
            isError: false,
            user: user,
          });
        } else {
          return sendErrorMessage(res, 200, "User has entered a wrong OTP.");
        }
      });
    } else {
      res.clearCookie("token");
      return sendErrorMessage(res, 200, "This user do not exist!");
    }
  });
};


// get User object from the given email ID.
module.exports.getUser = (req, res) => {
  if (isLoggedIn(req) == false) return sendErrorMessage(res, 200, "You need to sign in first.");

  const _email = req.body.email;

  User.findOne({ email: _email }, (err, user) => {
    if (err) return sendErrorMessage(res, 200, "Error in finding the user from the DB.");

    if (user) {
      return res.status(200).send({
        isError: false,
        user: user,
      });
    } else {
      res.clearCookie("token");
      return sendErrorMessage(res, 200, "This user do not exist!");
    }
  });
};


// update user profile details.
module.exports.updateUser = async (req, res) => {
  const _email = req.body.email;
  const _user = req.body.user;

  User.findOne({ email: _email }, async (err, user) => {
    if (err) return sendErrorMessage(res, 200, "Error in finding the user from the DB.");

    if (user) {
      user = updateUserValues(user, _user);
      await user.save();
      
      return res.status(200).send({
        isError: false,
        message: `User details updated with email ID ${_email}.`,
      });
    } else {
      res.clearCookie("token");
      return sendErrorMessage(res, 200, "This user do not exist!");
    }
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
        const secret = generateSecret();     // JSON object
        const qrcode = await generateQRCode(secret);

        // user.isVerified = true;
        user.secret = await encrypt(JSON.stringify(secret));
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
        res.clearCookie("token");
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
module.exports.verifyAuthyOtp = async (req, res) => {
  if (isLoggedIn(req) == true) return sendErrorMessage(res, 200, "You are already logged in.");

  const _email = req.body.email;
  const _otp = req.body.otp;

  User.findOne({email:_email}, async (err, user) => {
    if (err) return sendErrorMessage(res, 200, "Error while finding the user from the DB.");

    if (user) {
      await decrypt(user.secret).then(async (secret) => {
        let isAuthyCorrect = isVerified(secret, "ascii", parseInt(_otp));
        if (isAuthyCorrect == true) {
          user.isVerified = true;
          await user.save();
          return res.status(200).send({
            isError: false
          });
        } else {
          return sendErrorMessage(res, 200, "User has entered a wrong OTP.");
        }
      });
    } else {
      res.clearCookie("token");
      return sendErrorMessage(res, 200, "This user do not exist.")
    }
  })
}


// Forgot Password.
module.exports.forgotPassword = async (req, res) => {
  if (isLoggedIn(req) == true) return sendErrorMessage(res, 200, "You are already logged in.");

  const _email = req.body.email;
  const _otp = req.body.otp;

  // check if this user is already verified or not from the DB?
  User.findOne({email:_email}, async (err, user) => {
    if (err) return sendErrorMessage(res, 200, "Error while finding the user from the DB.");

    if (user) {
      await decrypt(user.secret).then((secret) => {
        let isAuthyCorrect = isVerified(secret, "ascii", parseInt(_otp));
        if (isAuthyCorrect == true) {
          return res.status(200).send({
            isError: false
          });
        } else {
          return sendErrorMessage(res, 200, "User has entered a wrong OTP.");
        }
      });
    } else {
      res.clearCookie("token");
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
      res.clearCookie("token");
      return sendErrorMessage(res, 200, "This user do not exist.")
    }
  });  
}


// Create campaign controller.
module.exports.createCampaign = async (req, res) => {
  // User needs to be authenticated to create a campaign.
  if (isLoggedIn(req) == false) return sendErrorMessage(res, 200, "You need to sign in first.");
  
  const _managerEmail = req.body.manager;
  const _campaignAddress = req.body.campaignAddress;
  const _contractFactoryAddress = req.body.contractFactoryAddress;
  const _campaignName = req.body.name;
  const _campaignDesc = req.body.description;
  const _campaignType = req.body.type;
  const _campaignMinAmount = req.body.minAmount;
  const _campaignTargetAmount = req.body.targetAmount;

  Campaign.findOne({ campaignAddress: _campaignAddress }, async (err, campaign) => {
      if (err) return sendErrorMessage(res, 200, "Error while finding this camapign from DB");

      // If this campaign is not already exist, then only create a new campaign. 
      if (!campaign) {
        let campaignObject = {
          manager: _managerEmail,
          campaignAddress: _campaignAddress,
          contractFactoryAddress: _contractFactoryAddress,
          name: _campaignName,
          description: _campaignDesc,
          type: _campaignType,
          minAmount: _campaignMinAmount,
          targetAmount: _campaignTargetAmount,
        };
        Campaign.create(campaignObject, async (err, campaign) => {
          if (err) return sendErrorMessage(res, 200, "Error while creating a campaign.");

          // find the user from the DB and put this campaign into this user campaign list too.
          User.findOne({ email: _managerEmail }, async (err, user) => {
            if (err) return sendErrorMessage(res, 200, "Error in finding the user from the DB.");

            if (user) {
              await user.myCreatedCampaigns.push(campaign.campaignAddress);
              await user.save();

              return res.status(200).send({
                isError: false,
                message: "Campaign Created Successfully.",
              });
            } else {
              res.clearCookie("token");
              return sendErrorMessage(res, 200, "User who wants to create this campaign do not exist.");
            }
          });
        });
      } else {
        return sendErrorMessage(res, 200, "This campaign is already exist.");
      }
    }
  );
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
      res.clearCookie("token");
      return sendErrorMessage(res, 200, "This user do not exist.");
    }
  });
}


// Get a campaign by providing campaignAddress and userEmail id.
module.exports.getCampaign = (req, res) => {
  if (isLoggedIn(req) == false) return sendErrorMessage(res, 200, "You need to sign in first.");

  const _campaignAddress = req.body.address;
  const _email = req.body.email;

  Campaign.findOne({campaignAddress: _campaignAddress}, async (err, campaignObj) => {
    if (err) return sendErrorMessage(res, 200, "Error in finding a campaign from the DB.");
    
    if (campaignObj) {
      User.findOne({email: _email}, async (err, user) => {
        if (err) return sendErrorMessage(res, 200, "Error while finding the user from DB.");

        if (user) {
          let your_contribution = 0, total_backers = 0, total_requests = 0;
          
          await campaignObj.contributedUsers.forEach((contributor) => {
            if (contributor.email == _email) {
              your_contribution += parseFloat(contributor.amount);
            }
          });

          total_backers += campaignObj.contributedUsers.length;
          total_requests += campaignObj.requests.length;

          let campaign_obj = {
            name: campaignObj.name,
            description: campaignObj.description,
            type: campaignObj.type,
            manager: campaignObj.manager,
            minAmount: campaignObj.minAmount,
            targetAmount: campaignObj.targetAmount,
            currentContribution: campaignObj.currentContribution,
            contributedUsers: campaignObj.contributedUsers,
            yourContribution: your_contribution,
            totalBackers: total_backers,
            totalRequests: total_requests
          };
          console.log("\n getCampaign(): ", campaign_obj);

          return res.status(200).send({
            isError: false,
            campaign: campaign_obj
          });
        } else {
          res.clearCookie("token");
          return sendErrorMessage(res, 200, "User with email ID provided by you do not exist.");
        }
      });
    } else {
      return sendErrorMessage(res, 200, "This campaign do not exist.");
    }
  });
}


// contribute to a campaign
module.exports.contribute = (req, res) => {
  if (isLoggedIn(req) == false) return sendErrorMessage(res, 200, "You need to sign in first.");

  const _campaignAddress = req.body.campaignAddress;
  const _email = req.body.email;
  const _amount = parseFloat(req.body.amount);

  console.log("\n contribute-request", _email, _amount);

  Campaign.findOne({campaignAddress: _campaignAddress}, (err, campaign) => {
    if (err) return sendErrorMessage(res, 200, "Error in finding a campaign from the DB.");

    if (campaign) {
      User.findOne({email: _email}, async (err, user) => {
        if (err) return sendErrorMessage(res, 200, "Error while finding the user from DB.");

        if (user) {

          console.log("contribute-user-1: ", user.totalAmountContributed, user.myContributedCampaigns);
          let userFlag = 0;
          await user.myContributedCampaigns.forEach((userContribution) => {
            if (userContribution.campaignAddress == _campaignAddress) {
              userContribution.amount += _amount;
              userFlag = 1;
            }
          });
          if (userFlag == 0) {
            user.myContributedCampaigns.push({ campaignAddress: _campaignAddress, amount: _amount, Date: Date() });
          }
          user.totalAmountContributed += _amount;
          await user.save().then(()=>{console.log("contribute-user-2: ", user.totalAmountContributed, user.myContributedCampaigns)});
          

          console.log("\n\n");

          console.log("contribute-campaign-1: ", campaign.currentContribution, campaign.contributedUsers);
          let campaignFlag = 0;
          await campaign.contributedUsers.forEach((contributed_user) => {
            if (contributed_user.email == _email) {
              contributed_user.amount += _amount;
              campaignFlag = 1;
            }
          });
          
          if (campaignFlag == 0) {
            campaign.contributedUsers.push({ email: _email, amount: _amount, Date: Date() });
          }
          campaign.currentContribution += _amount;
          await campaign.save().then(()=>{console.log("contribute-campaign-2: ", campaign.currentContribution, campaign.contributedUsers);});

          return res.status(200).send({
            isError: false
          });

        } else {
          res.clearCookie("token");
          return sendErrorMessage(res, 200, "This user do not exist.");
        }
      });
    } else {
      return sendErrorMessage(res, 200, "Campaign where you want to contribute do not exist.");
    }
  }); 
}