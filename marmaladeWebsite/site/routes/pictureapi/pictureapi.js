const express = require('express');
const picture = express.Router();
const userdb = require('../../config/db-config.js').userdb;


picture.get('/profileimage', async (req, res) => {
    if(req.authenticated.auth){
        params = [req.authenticated.id];
        let sql = "SELECT * FROM photos WHERE Mem_ID = (?)";
        let username_sql = "SELECT * FROM members WHERE ID = (?)";

        var details = await new Promise((resolve, reject) =>{
            userdb.all(username_sql, params, (err, result) =>{
                if(err){
                    reject(new Error(err.message));
                }
                else{
                    resolve(result);
                }
            })
        }).then((result) => {
            if(result === undefined){
                return "Profile";
            }
            else{
                return result[0].Name;
            }
        }).catch((err) => console.log(err.message));

        console.log(details);

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
                return rows.reverse();
            }
        }).catch((err) => console.log(err.message));
        var response = {images:image_path, username:details};
        console.log(JSON.stringify(response));
        res.json(response);
        
    }
    else{
        res.redirect('/unauthorized');
    }
});

picture.get('/getall', async (req, res) =>{
    let sql = "SELECT * FROM photos";
    var image_path = await new Promise((resolve, reject) =>{
        userdb.all(sql, (err, row)=>{
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
            return rows.reverse();
        }
    }).catch((err) => console.log(err.message));
    var response = {images:image_path}
    res.json(response);
});


module.exports = picture;

