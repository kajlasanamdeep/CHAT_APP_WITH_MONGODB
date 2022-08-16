const {chats} = require('../models');
const users = {};
module.exports = (socket) => {
    socket.on('online', (user) => {
        console.log(user);
        socket.username = user.username;
        socket.userId = user.userId;
        users[user.userId] = socket.id;
    });
    socket.on('message',async(data) => {
        let socketId = users[data.contactId];
        socket.to(socketId).emit('message', {
            contactId: socket.userId,
            contactname: socket.username,
            message: data.message
        });
        await chats.create({
            message: data.message,
            to: data.contactId,
            from: socket.userId
        });
    });
}