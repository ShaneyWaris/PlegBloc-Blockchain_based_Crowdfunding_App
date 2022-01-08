const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home_controller");
console.log("Router is Loaded.");


// Landing page routes.
router.get("/", homeController.home);
router.post("/signup", homeController.signup);
router.post("/signin", homeController.signin);
router.post("/logout", homeController.logout);


// Profile updation.
router.post("/updateUser", homeController.updateUser);


// User authentication routes.
router.post("/verifyEmail", homeController.verifyEmail);
router.post("/verifyAuthyOtp", homeController.verifyAuthyOtp);


// Forgot Password.
router.post("/forgotPassword", homeController.forgotPassword);
router.post("/updatePassword", homeController.updatePassword);


// Other user related routes.
router.post("/getUser", homeController.getUser);
router.post("/contact-us", homeController.contactus);


// campaign related routes.
router.post("/createCampaign", homeController.createCampaign);
router.post("/getCampaign", homeController.getCampaign);
router.post("/activeCampaigns", homeController.activeCampaigns);
router.post("/myCampaigns", homeController.myCampaigns);
router.post("/myContributedCampaigns", homeController.myContributedCampaigns);
router.post("/contribute", homeController.contribute);


// vendor related routes.
router.post("/vendorRegistration", homeController.vendorRegistration);
router.post("/getVendors", homeController.getVendors);
router.post("/getVendor", homeController.getVendor);


// request related routes
router.post("/createRequest", homeController.createRequest);
router.post("/getRequests", homeController.getRequests);
router.post("/approveRequest", homeController.approveRequest);


module.exports = router;