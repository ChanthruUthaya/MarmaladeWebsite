const express = require('express');
const picture = express.Router();
const userdb = require('../../config/db-config.js').userdb;


picture.get('/', (req, res) => {
    if(req.authenticated.auth){
        
    }
});

module.exports = picture;