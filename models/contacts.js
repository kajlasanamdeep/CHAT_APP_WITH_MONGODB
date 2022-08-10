const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userModel = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    contactId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    isBlocked: {
        type:Boolean,
        default:false
    }
});
module.exports = mongoose.model('contacts', userModel);