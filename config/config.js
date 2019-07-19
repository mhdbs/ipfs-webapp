require('dotenv').config();
const IPFS_HOST = process.env.IPFS_HOST || '127.0.0.1'
const IPFS_PORT = process.env.IPFS_PORT || 5001
const IPFS_PROTOCOL = process.env.IPFS_PROTOCOL || 'http'

module.exports = {
    ipfs_host: IPFS_HOST,
    ipfs_port : IPFS_PORT,
    ipfs_protocol: IPFS_PROTOCOL
}