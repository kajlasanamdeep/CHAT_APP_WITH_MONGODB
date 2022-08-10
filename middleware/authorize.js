const users = require('../models').users;
const response = require('../libs/response');
const messages = require("../constants/messages");
const universalFunction = require('../libs/universalfunctions');
module.exports = async (req, res, next) => {
    try {
        if (req.headers.authorization) {

            let accessToken = req.headers.authorization;

            if (accessToken.startsWith('Bearer')) {
                [, accessToken] = accessToken.split(' ');
            };

            const decodedData = await universalFunction.jwtVerify(accessToken);
            let userData = await users.findById(decodedData._id, { password: 0 });

            if (userData) {

                req.loggedUser = userData;
                next();

            } else {

                return response.forBiddenResponse(res, messages.INVALID_TOKEN);

            }

        } else {

            return response.unauthorizedResponse(res, messages.UNAUTHORIZED);

        }

    } catch (error) {

        return response.errorResponse(res, messages.INVALID_TOKEN);

    }
}
