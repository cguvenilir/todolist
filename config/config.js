
// const config = require('./config.json');
// const urlConfig = config.url;
//
// global.gConfig = urlConfig;

const path = require('path')
const dotenv = require('dotenv')
require('dotenv').config();
// Load config
dotenv.config({ path: './config/config.env' })

module.exports = {
    url: process.env.URL
};
