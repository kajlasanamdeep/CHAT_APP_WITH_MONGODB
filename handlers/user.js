const universalFunction = require('../libs/universalfunctions');
const Model = require('../models');
const messages = require("../constants/messages");
const statusCodes = require("../constants/statusCodes");

module.exports.registerORlogin = async function (payload) {
    try {
        let user = await Model.users.findOne({
            email: payload.email
        });

        if (user) {
            let passwordIsCorrect = await universalFunction.comparePasswordUsingBcrypt(payload.password, user.password);
            if (!passwordIsCorrect) {
                return universalFunction.returnError(statusCodes.UNPROCESSABLE_ENTITY, messages.INVALID_PASSWORD);
            }
        }
        else if (!user) {
            payload.password = await universalFunction.hashPasswordUsingBcrypt(payload.password);
            user = await Model.users.create(payload);
        };
        let accessToken = await universalFunction.jwtSign(user);
        return universalFunction.returnData(statusCodes.SUCCESS, messages.USER_LOGGED, { accessToken });
    } catch (error) {
        throw error;
    }
};
module.exports.getUsers = async function (payload) {
    try {
        let users = await Model.users.aggregate([
            {
                $match: {
                    $and: [
                        { _id: { $ne: payload.userId } }
                    ]
                }
            },
            {
                $project: {
                    username:{$first:{$split:['$email','@']}},
                    userId:"$_id",
                    _id:0
                }
            }
        ]);
        return universalFunction.returnData(statusCodes.SUCCESS, messages.SUCCESS, { users: users });
    } catch (error) {
        throw error;
    }
}
module.exports.addContact = async function (payload) {
    try {
        let contact = await Model.users.findById(payload.contactId);
        if (!contact) {
            return universalFunction.returnError(statusCodes.BAD_REQUEST, messages.INVALID_CONTACT);
        }
        let existing = await Model.contacts.findOne({
            contactId: contact._id,
            userId: payload.userId
        });
        if (!existing) {
            await Model.contacts.create({
                contactId: contact._id,
                userId: payload.userId
            });
        }
        return universalFunction.returnData(statusCodes.SUCCESS, messages.CONTACT_REGISTERED);
    } catch (error) {
        throw error;
    }
}
module.exports.getDashboard = async function (payload) {
    try {
        let userdata = await Model.users.aggregate([{
            $match: {
                _id: payload._id
            }
        },
        {
            $lookup: {
                from: "contacts",
                pipeline: [
                    {
                        $match: {
                            $or: [
                                { userId: payload._id },
                                { contactId: payload._id }
                            ]
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: {
                                contactId: "$contactId",
                                userId: "$userId"
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $or: [
                                                { $and: [{ $eq: ['$_id', '$$userId'] }, { $ne: ['$_id', payload._id] }] },
                                                { $and: [{ $eq: ['$_id', '$$contactId'] }, { $ne: ['$_id', payload._id] }] }
                                            ]
                                        }
                                    }
                                },
                                ],
                            as: "details"
                        }
                    },
                    {
                        $unwind: "$details"
                    },
                    {
                        $project: {
                            _id:0,
                            contactId: "$details._id",
                            contactname:{$first:{$split:['$details.email','@']}}
                        }
                    }
                ],
                as: 'contacts'
            }
        },
        {
            $project:{
                _id:0,
                userId:"$_id",
                username:{$first:{$split:['$email','@']}},
                email:"$email",
                contacts:"$contacts",
            }
        }
        ]);
        return universalFunction.returnData(statusCodes.SUCCESS, messages.SUCCESS,{userdata:userdata[0]});
    } catch (error) {
        throw error;
    }
};