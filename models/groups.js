const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const groupModel = new Schema({
    name: {
        type: String,
        required:true
    },
    members:{
        type:[Schema.Types.ObjectId],
        default:[]
    },
    createdBy: {
        type: String,
        required:true
    },
    createdOn: {
        type: Date,
        default:Date.now()
    },
    isDeleted: {
        type:Boolean,
        default:false
    }
});

module.exports = mongoose.model('groups', groupModel);