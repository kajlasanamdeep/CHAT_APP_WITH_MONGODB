const handler = require("../handlers");
const response = require("../libs/response");

module.exports.registerORlogin = async function (req, res) {
    try {
        const payload = await handler.user.registerORlogin(req.body);
        return response.sendResponse(res, payload.status, payload.message, payload.data);
    } catch (error) {
        return response.errorResponse(res, error);
    }
};

module.exports.getDashboard = async function (req, res) {
    try {
        const payload = await handler.user.getDashboard(req.loggedUser);
        return response.sendResponse(res, payload.status, payload.message, payload.data);
    } catch (error) {
        return response.errorResponse(res, error);
    }
};
module.exports.getUsers = async function (req, res) {
    try {
        const payload = await handler.user.getUsers({search:req.query.search,userId:req.loggedUser._id});
        return response.sendResponse(res, payload.status, payload.message, payload.data);
    } catch (error) {
        return response.errorResponse(res, error);
    }
};
module.exports.addContact = async function (req, res) {
    try {
        const payload = await handler.user.addContact({contactId:req.params.contactId,userId:req.loggedUser._id});
        return response.sendResponse(res, payload.status, payload.message, payload.data);
    } catch (error) {
        return response.errorResponse(res, error);
    }
};
module.exports.getMessages = async function (req, res) {
    try {
        const payload = await handler.user.getMessages({contactId:req.params.contactId,user:req.loggedUser});
        return response.sendResponse(res, payload.status, payload.message, payload.data);
    } catch (error) {
        return response.errorResponse(res, error);
    }
};