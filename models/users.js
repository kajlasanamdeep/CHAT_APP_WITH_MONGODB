const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userModel = new Schema({
    email: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    isDeleted: {
        type:Boolean,
        default:false
    }
});

module.exports = mongoose.model('users', userModel);