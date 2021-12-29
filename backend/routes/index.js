const express = require("express");
const router = express.Router();
console.log("Router is Loaded.");

const homeController = require("../controllers/home_controller");

router.get("/", homeController.home);
router.post("/signup", homeController.signup);
router.post("/signin", homeController.signin);
router.post("/createCampaign", homeController.createCampaign);
router.post("/getUser", homeController.getUser);
router.post("/updateUser", homeController.updateUser);
router.post("/logout", homeController.logout);
router.post("/activeCampaigns", homeController.activeCampaigns);
router.post("/myCampaigns", homeController.myCampaigns);
router.post("/myContributedCampaigns", homeController.myContributedCampaigns);

module.exports = router;