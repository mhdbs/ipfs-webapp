const fs = require('fs');
const path = require('path');
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compression = require("compression");
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const https= require('https');
const http= require('http');
require('dotenv').config();

let logger = require("./utils/logger").getLogger("APP");
let logDirectory = path.join(__dirname, 'logs')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var ipfs = require('./routes/ipfs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(compression());

var accessLogStream = rfs('access.log', {
    interval: '1d', 
    path: logDirectory
});
var errorLogStream = rfs('error.log', {
    interval: '1d', 
    path: logDirectory
});

app.use(morgan('short', {
    skip: function (req, res) {
        return res.statusCode > 400;
    },
    stream: accessLogStream
}));

app.use(morgan('short', {
    skip: function (req, res) {
        return res.statusCode < 400;
    },
    stream: errorLogStream
}));

app.use(function(req, res, next) {
    var allowedOrigins = [
        "http://127.0.0.1:3000"
    ];

    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    var method_requested = req.headers['access-control-request-method']||'POST';
    res.setHeader(
        "Access-Control-Allow-Methods",
        method_requested
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,Content-Type,X-Auth-Token"
    );

    res.setHeader("Access-Control-Allow-Credentials", true);

    if ("OPTIONS" == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use('/ipfs', ipfs);

app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") == "development" ? err : {};
    logger.error("Error handler : ", err);
    return res.status(err.status || 500).send(err);
});

let server;
if (process.env.SERVER == 'LOCAL') {
    server = https.createServer(app);
} else {
    server = http.createServer(app);
    logger.info('APP to serve http requests.')
}
server.listen(process.env.PORT || 3000);
server.on('listening', () => {
    logger.debug("Auth server started on port: ", server.address())
});
