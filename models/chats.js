const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatModel = new Schema({
    to:{
        type: Schema.Types.ObjectId,
        required:true
    },
    from:{
        type: Schema.Types.ObjectId,
        required:true,
        ref: 'users'
    },
    message: {
        type: String,
        required:true
    },
    at: {
        type: Date,
        default:Date.now()
    },
    deletedFor:{
        type:[Schema.Types.ObjectId],
        default:[]
    },
    isDeleted: {
        type:Boolean,
        default:false
    }
});

module.exports = mongoose.model('chats', chatModel);