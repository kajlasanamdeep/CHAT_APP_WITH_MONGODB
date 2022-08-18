const app = require('express')();
const server = require('http').createServer(app);
const connection = require('./db/connection');
const bodyparser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');
const config  = require('./config/server');
const sockets = require('./socket.io/sockets');
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (['http://localhost:3000','http://localhost:3001','http://localhost:3002','http://localhost:3003'].indexOf(origin) === -1) {
            let msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    optionsSuccessStatus: 200
};
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(routes);
const io = require('socket.io')(server,{cors:{origin:['http://localhost:3000','http://localhost:3001','http://localhost:3002','http://localhost:3003']}});
io.on('connection',sockets);
connection.connect().then((connected) => {

    server.listen(process.env.PORT || config.PORT, (err) => {

        if (err) throw err;
        else console.log(`App Running on port ${process.env.PORT || config.PORT}`);

    });

    console.log(connected);

}).catch((error) => {

    console.log("Database Connection Error:", error);

});