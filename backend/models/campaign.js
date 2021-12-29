const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
    // Required Fields.
    // Manager is the one who create the campaign?
    manager: {                  // email ID
        type: String,
        required: true
    },
    campaignAddress: {
        type: String,
        default: "",
        required: true
    },
    contractFactoryAddress: {
        type: String,
        required: true,
        default: ""
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    minAmount: {
        type: Number,
        required: true,
    },
    targetAmount: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Not Required Fields.
    requests: [{
        type: Object
    }],
    contributedUsers: [{
        type: Object
    }],
}, {
    timestamps: true,
});

const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;