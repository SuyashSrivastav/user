const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var userSchema = new Schema({

    name: String,
    email: String,
    is_email_verified: {
        type: Boolean,
        default: false
    },
    password: String,
    is_active: {
        type: Boolean,
        default: true
    },
    previpus_login_info_array: [{
        token: String,
        login_date: Date
    }],
    created_at: Date

});

module.exports = mongoose.model("User", userSchema);