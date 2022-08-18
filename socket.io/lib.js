const { contacts } = require('../models');

module.exports.getRooms = async function (userId) {
    try {
        let rooms = await contacts.find({
            $or: [
                { userId: userId },
                { contactId: userId }
            ]
        });
        return rooms.map((room) => room.id);
    } catch (error) {
        throw error
    }
};

module.exports.getRoom = async function (userId, contactId) {
    try {
        let room = await contacts.findOne({
            $and: [
                { userId: { $in: [contactId, userId] } },
                { contactId: { $in: [contactId, userId] } }
            ]
        });
        return room.id;
    } catch (error) {
        throw error
    }
}