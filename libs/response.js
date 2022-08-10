const statusCode = require("../constants/statusCodes");
const messages = require("../constants/messages");

module.exports.sendResponse = async (res, code, message, data) => {
	code = code || statusCode.SUCCESS;
	message = message || messages.SUCCESS;
	data = data || {};
	return res.status(code).send({
		statusCode: code,
		message: message,
		data: data
	});
};

module.exports.unauthorizedResponse = async (res, message) => {
	const code = statusCode.UNAUTHORIZED;
	message = message || messages.UNAUTHORIZED;
	return res.status(code).send({
		statusCode: code,
		message: message
	});
};

module.exports.forBiddenResponse = async (res, message) => {
	const code = statusCode.FORBIDDEN;
	message = message || messages.FORBIDDEN;
	return res.status(code).send({
		statusCode: code,
		message: message
	});
};

module.exports.validationErrorResponse = async (res, error) => {
	const code = statusCode.UNPROCESSABLE_ENTITY;
	return res.status(code).send({
		statusCode: code,
		message:error.message.replace(new RegExp('\\"',"g"),"") 
	});
};

module.exports.errorResponse = async (res, error) => {
	const code = statusCode.INTERNAL_SERVER_ERROR;
	console.log(error.stack);
	return res.status(code).send({
		statusCode: code,
		message:messages.SERVER_ERROR
	});
};