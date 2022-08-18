// Importing package modules
const app = require('express')();
const server = require('http').createServer(app);
const bodyparser = require('body-parser');
const cors = require('cors');

// Importing File modules
const routes = require('./routes');
const socketIo = require('./socket.io');
const config = require('./config/server');
const connection = require('./db/connection');

// Declaring constant variables
const origins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (origins.indexOf(origin) === -1) {
            let msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    optionsSuccessStatus: 200
};

// setting application middlewares
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(routes);

//Initalizing socketIO server
socketIo(require('socket.io')(server, { cors: { origin: origins } }));

// connecting database & running server
connection.connect().then((connected) => {

    server.listen(process.env.PORT || config.PORT, (err) => {

        if (err) throw err;
        else console.log(`App Running on port ${process.env.PORT || config.PORT}`);

    });

    console.log(connected);

}).catch((error) => {

    console.log("Database Connection Error:", error);

});