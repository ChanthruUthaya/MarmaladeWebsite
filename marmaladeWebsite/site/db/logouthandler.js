const express = require('express');
const logouthandler = express.Router();


const sessdb = require('../config/db-config.js').sessiondb;

logouthandler.get('/',async (req, res) => {
    if(req.authenticated.auth){
        let sql = "DELETE FROM sessiontable WHERE sid = (?)"
        let sql1 = "DELETE FROM sessionmap WHERE PID = (?)"
        await new Promise((resolve, reject) =>{
            sessdb.run(sql, [req.authenticated.cookie], (err)=>{
                if(err){
                    reject(new Error(err.message));
                }
                else{
                    resolve("deleted");
                }
            })
        });
        await new Promise((resolve, reject) =>{
            sessdb.run(sql1, [req.authenticated.id], (err)=>{ //check if all entries deleted or just 1
                if(err){
                    reject(new Error(err.message));
                }
                else{
                    resolve("deleted");
                }
            })
        });
        res.redirect("/index.html"); 
    }
    else{
        res.redirect('/unauthorized');
    }
})

module.exports = logouthandler;