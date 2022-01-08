const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    // Required Fields.
    index: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
        default: ""
    },
    description: {
        type: String,
        required: true,
        default: ""
    },
    amount: {
        type: Number,
        default: 0,
        required: true
    },
    vendorName: {
        type: String,
        required: true,
    },
    vendorAddress: {
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
    backers: [],            // list of unique email IDs: Its length will represent be the number of votes.
}, {
    timestamps: true,
});


const Request = mongoose.model("Request", requestSchema);

module.exports = Request;