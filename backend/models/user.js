const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    // Required Fields.
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    // Not Required Fields.
    myCampaignFactoryAddress: {
        type: String,
        default: "",
    },
    myCreatedCampaigns: [{
        type: Object
    }],
    myContributedCampaigns: [{
        type: Object
    }]
}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;