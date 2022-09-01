const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatModel = new Schema({
    userId: { 
        type: Schema.Types.ObjectId,
        required:true,
        ref: 'users'
    },
    contactId: {
        type: Schema.Types.ObjectId,
        required:true,
        ref: 'users'
    },
    createdOn: {
        type: Date,
        default:Date.now()
    },
    isBlocked: {
        type:Boolean,
        default:false
    },
    isDeleted: {
        type:Boolean,
        default:false
    }
});
module.exports = mongoose.model('contacts', chatModel);