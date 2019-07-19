'use strict'
const log4js = require("log4js");
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');
log4js.configure({
    appenders: {
        out: {
            type: 'stdout'
        },
        app: {
            type: 'file',
            filename: 'logs/app.log'
        }
    },
    categories: {
        default: {
            appenders: ['out', 'app'],
            level: 'debug'
        }
    }
});

function getLogger(instance) {
    let logger = log4js.getLogger(instance);
    logger.level = process.env.LOG_LEVEL;
    return logger;
}

let logDirectory = path.join(__dirname,'../', 'logs')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var accessLogStream = rfs('access.log', {
    interval: '1d', 
    path: logDirectory
});
var errorLogStream = rfs('error.log', {
    interval: '1d', 
    path: logDirectory
});



module.exports = {
    getLogger: getLogger,
    accessLogStream: accessLogStream,
    errorLogStream: errorLogStream
};