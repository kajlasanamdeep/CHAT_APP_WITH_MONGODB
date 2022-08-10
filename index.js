const app = require('express')();
const server = require('http').createServer(app);
// const io = require('socket.io')(server);
const connection = require('./db/connection');
const bodyparser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');
const config  = require('./config/server');
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (['https://localhost:3000'].indexOf(origin) === -1) {
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

connection.connect().then((connected) => {

    server.listen(process.env.PORT || config.PORT, (err) => {

        if (err) throw err;
        else console.log(`App Running on port ${process.env.PORT || config.PORT}`);

    });

    console.log(connected);

}).catch((error) => {

    console.log("Database Connection Error:", error);

});