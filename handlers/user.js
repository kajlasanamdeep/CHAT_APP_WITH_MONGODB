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
        let $match = {
            $and: [
                { _id: { $ne: payload.userId } }
            ]
        };
        if (payload.search) {
            $match.$and.push({ email: { $regex: payload.search, $options: "i" } });
        }
        let users = await Model.users.aggregate([
            {
                $match: $match
            },
            {
                $project: {
                    username: { $first: { $split: ['$email', '@'] } },
                    userId: "$_id",
                    _id: 0
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
            $and: [
                {
                    $or: [
                        { userId: payload.userId },
                        { contactId: payload.userId }
                    ]
                },
                {
                    $or: [
                        { userId: contact._id },
                        { contactId: contact._id }
                    ]
                }
            ]
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
                            contactId: "$details._id",
                            contactname: { $first: { $split: ['$details.email', '@'] } }
                        }
                    }
                ],
                as: 'contacts'
            }
        },
        {
            $project: {
                _id: 0,
                userId: "$_id",
                username: { $first: { $split: ['$email', '@'] } },
                email: "$email",
                contacts: "$contacts",
            }
        }
        ]);
        return universalFunction.returnData(statusCodes.SUCCESS, messages.SUCCESS, { userdata: userdata[0] });
    } catch (error) {
        throw error;
    }
};

module.exports.getMessages = async function (payload) {
    try {
        let contact = await Model.users.findById(payload.contactId);
        if (!contact) {
            return universalFunction.returnError(statusCodes.BAD_REQUEST, messages.INVALID_CONTACT);
        }
        let chats = await Model.chats.aggregate([
            {
                $match: {
                    $or: [
                        { $and: [{ to: contact._id }, { from: payload.user._id }] },
                        { $and: [{ to: payload.user._id }, { from: contact._id }] }
                    ]
                }
            },
            {
                $sort:{
                    at:1
                }
            },
            {
                $project: {
                    to: { $cond: [{ $eq: ['$to', payload.user._id] }, payload.user.email.split('@')[0], contact.email.split('@')[0]] },
                    from: { $cond: [{ $eq: ['$from', payload.user._id] }, payload.user.email.split('@')[0], contact.email.split('@')[0]] },
                    type: { $cond: [{ $eq: ['$to', payload.user._id] }, 'received', 'sended'] },
                    message: 1,
                    at: "$at"
                }
            }
        ]);
        return universalFunction.returnData(statusCodes.SUCCESS, messages.SUCCESS, { messages: chats });
    }
    catch (error) {
        throw error;
    }
}