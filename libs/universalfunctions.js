const jwt = require('jsonwebtoken');
const config = require('../config/server');
const bcrypt = require('bcrypt');

module.exports.hashPasswordUsingBcrypt = async (plainTextPassword) => {
	const saltRounds = 10;
	return bcrypt.hashSync(plainTextPassword, saltRounds);
};
module.exports.jwtSign = async (payload) => {
	return jwt.sign({ _id: payload._id }, config.JWT_SECRETKEY, { expiresIn: "1d" });
};
module.exports.jwtVerify = async (token) => {
	return jwt.verify(token, config.JWT_SECRETKEY);
};

module.exports.comparePasswordUsingBcrypt = async (plainTextPassword, hashedPassword) => {
	return bcrypt.compareSync(plainTextPassword, hashedPassword);
};
module.exports.returnData = (status,message,data)=>{
    return {
        status:status,
        message:message,
        data:data
    }
};
module.exports.returnError = (status,message)=>{
    return {
        status:status,
        message:message
    }
};
