const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatModel = new Schema({
    to:{
        type: Schema.Types.ObjectId
    },
    from:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    message: {
        type: String
    },
    at: {
        type: Date,
        default:Date.now()
    },
    deletedFor:{
        type:Array,
        default:[]
    },
    isDeleted: {
        type:Boolean,
        default:false
    }
});

module.exports = mongoose.model('chats', chatModel);