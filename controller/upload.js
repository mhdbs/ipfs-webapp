const logger = require("../utils/logger").getLogger("Upload");


function uploadPayload(req,res) {
    return new Promise(async function(resolve,reject) {
        console.log("ok function executed",req);
        return res.status(200).send({
            "msg": "Success"
        })  
    })
}

module.exports = {
    uploadPayload : uploadPayload
}