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
    myCampaignFactoryAddress: {
        type: String,
        required: true
    },
     // Not Required Fields.
    secret: {                          // secret is stored in encrypted format.
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    myCreatedCampaigns: [],            // [ campaignAddress_1, campaignAddress_2, ..., campaignAddress_n ]

    myContributedCampaigns: [{         // [{ campaignAddress: "", amount: "", Date: "" }, {}, ... ]
        type: Object
    }],
    totalAmountContributed: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;