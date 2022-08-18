const { chats } = require('../models');
const { getRooms, getRoom } = require('./lib');
module.exports = (io) => {
    return io.on('connection', (socket) => {
        socket.on('online', async (user) => {
            try {
                socket.userId = user.userId;
                socket.username = user.username;
                let rooms = await getRooms(user.userId);
                socket.join(rooms);
            } catch (error) {
                socket.emit('error', error.message);
            }
        });
        socket.on('message', async (data) => {
            try {
                let room = await getRoom(socket.userId, data.contactId);
                let message = await chats.create({
                    message: data.message,
                    to: data.contactId,
                    from: socket.userId
                });
                io.to(room).emit('new message', message);
            } catch (error) {
                socket.emit('error', error.message);
            }
        });
    });
}