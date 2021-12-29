const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    // Required Fields.
    description: {
        type: String,
        required: true,
        default: ""
    },
    value: {
        type: Number,
        default: 0,
        required: true
    },
    recepientAddress: {
        type: String,
        required: true,
        default: ""
    },
    campaignAddress: {
        type: String,
        default: "",
        required: true
    },
    // Not Required Fields.
    isComplete: {
        type: Boolean,
        default: false,
    },
    voteCount: {
        type: Number,
        default: 0
    },
    approvers: [{
        type: Object
    }],
}, {
    timestamps: true,
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;