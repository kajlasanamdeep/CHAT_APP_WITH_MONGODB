const mongoose = require('mongoose');
const db = require('../config/db');
function connect() {
    return new Promise((connect,error)=>{
        const DBURL = `mongodb+srv://${db.USERNAME}:${db.PASSWORD}@${db.CLUSTER_LINK}.mongodb.net/${db.DB_NAME}?retryWrites=true&w=majority`;
        mongoose.connect(DBURL,(err,connected)=>{
            if(err) return error(err);
            else if(connected) return connect("Database Connected SuccessFully!");
        })
    })
}
module.exports = {connect};