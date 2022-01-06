const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
    // Required Fields.
    manager: {
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
    type: {
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
    contributedUsers: [{        // [ { email: "", amount: "", Date: "" }, {}, ....., {} ] => No. of backers
        type: Object        
    }],
    currentContribution: {      // sum of all the contributions received from all users.
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
});

const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;