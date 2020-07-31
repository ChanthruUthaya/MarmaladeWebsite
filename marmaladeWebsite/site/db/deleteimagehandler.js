const express = require('express');
const deleteimage = express.Router();
const fs = require('fs');
const path = require('path');


const userdb = require('../config/db-config.js').userdb;

deleteimage.delete('/' , async (req, res)=>{
    const id = parseInt(req.body.id,10);
    const pic_path = path.join(__dirname,`/uploads/${req.body.src}`);
    let sql = "DELETE FROM photos WHERE (PhotoID) = (?)"
    await new Promise((resolve, reject) =>{
        userdb.run(sql, [id], (err)=>{
            if(err){
                reject(new Error(err.message));
            }
            else{
                resolve("deleted photo in db");
            }
        })
    }).then((result) => console.log(result)).catch((err) => console.log(err.message));
    try{
        fs.unlinkSync(pic_path);
    } catch(err) {
        console.log(`delete photo error: ${err.message}`);
    }

    res.status(200).send("ok");
})

module.exports = deleteimage;