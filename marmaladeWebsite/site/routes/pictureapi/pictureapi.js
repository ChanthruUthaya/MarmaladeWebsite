const express = require('express');
const picture = express.Router();
const userdb = require('../../config/db-config.js').userdb;


picture.get('/', async (req, res) => {
    if(req.authenticated.auth){
        params = [req.authenticated.id];
        let sql = "SELECT * FROM photos WHERE Mem_ID = (?)"
        var image_path = await new Promise((resolve, reject) =>{
            userdb.all(sql, params, (err, row)=>{
                if(err){
                    reject(new Error(err.message));
                }
                else{
                    resolve(row);
                }
            });
        }).then((rows) => {
            if(rows == undefined){
                return [];
            }
            else{
                return rows;
            }
        }).catch((err) => console.log(err.message));
        console.log(JSON.stringify(image_path));
        res.json({images:image_path});
        
    }
    else{
        res.redirect('/unauthorized');
    }
});

module.exports = picture;

