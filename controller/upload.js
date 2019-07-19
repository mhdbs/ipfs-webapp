const logger = require("../utils/logger").getLogger("Upload");
const formidable = require("formidable");
const ipfsAPI = require('ipfs-api');
const config = require('../config/config');

const ipfs = ipfsAPI({
    host: config.ipfs_host,
    port: config.ipfs_port,
    protocol: config.ipfs_protocol
})

function uploadPayload(req,res) {
    return new Promise(async function(resolve,reject) {
        var form = new formidable.IncomingForm();
        await form.on("file", async function (name, file) {
            console.log("inside form.on", name, file.name, "path", file.path);
        })
        form.parse(req);
        return res.status(200).send({
            "msg": "Success"
        })  
    })
}

module.exports = {
    uploadPayload : uploadPayload
}