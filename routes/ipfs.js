'use strict';

var express = require('express');

var router = express.Router();

var ipfsUpload = require('../controller/upload');

router.post('/upload', ipfsUpload.uploadPayload);

module.exports = router;
