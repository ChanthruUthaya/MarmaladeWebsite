const express = require('express');
const picture = express.Router();
const userdb = require('../../config/db-config.js').userdb;


picture.get('/', async (req, res) => {
    if(req.authenticated.auth){
        params = [req.authenticated.id];
        let sql = "SELECT * FROM photos WHERE Mem_ID = (?)"
        await new Promise((resolve, reject) =>{
            userdb.all(sql, params, (err, row)=>{
                if(err){
                    console.log(err.message);
                    reject(new Error(err.message));
                }
                else{
                    console.log(`${JSON.stringify(row)}`);
                    resolve(row);
                }
            });
        });
        res.send(`user id is ${req.authenticated.id}`);
    }
    else{
        res.redirect('/unauthorized');
    }
});

module.exports = picture;

