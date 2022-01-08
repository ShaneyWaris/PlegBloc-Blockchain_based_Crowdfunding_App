const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    // Required Fields.
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    }, 
    description : {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    address: {
        type: String,
        required: true
    },
    manager: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;