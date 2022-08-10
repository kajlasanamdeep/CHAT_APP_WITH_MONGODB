const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userModel = new Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    isDeleted: {
        type:Boolean,
        default:false
    }
});

module.exports = mongoose.model('users', userModel);