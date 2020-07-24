const express = require('express');
const dbhandler = express.Router();
const sqlite3 = require('sqlite3');
const crypto = require('crypto');
const db = require('../config/db-config.js').userdb;



// let db = new sqlite3.Database('./db/marmalade.db',(err) => {
//     if(err) {
//         console.log(err.message);
//     }
//     console.log('connected to user database');
// });

dbhandler.post('/', async function(req, res){
    const obj = JSON.parse(JSON.stringify(req.body));
    var params = [obj.name, obj.email.toLowerCase()];
    let placeholders = params.map((param) => '?').join(',');
    let sql = 'INSERT INTO members (Name, Email) VALUES ' + `(${placeholders})`;
    const keyparams = await encrypt(obj.password).catch((err)=> alert(err));
    var name_errorlist = lettersnamecheck(obj.name);
    await namecheckpromise(obj.name).then((result)=>{
        if(result > 0){
            console.log("username taken");
            name_errorlist.unshift("Invalid Input, Username already taken");
        }
    });
    var email_errorlist =["Email Ok"];
    await emailcheckpromise(obj.email.toLowerCase()).then((result) =>{
        if(result>0){
            console.log("email taken");
            email_errorlist.unshift("Invalid Input, Email already taken")
        }
    });
    if(name_errorlist.length == 1 && email_errorlist.length == 1){  //use in then
        var response = await insertMember(sql,params,name_errorlist,email_errorlist).catch((err)=> alert(err));
        var id = await getid().catch((err)=> alert(err));
        keyparams.unshift(id['last_insert_rowid()']);
        console.log(keyparams);
        var passJSON = await insertpassword(keyparams);
        response.passerror = passJSON.passerror;
        res.json(response);
        console.log("Routine Finished: Inserted");

    }
    else{
        res.json({nameerror:`${name_errorlist[0]}`,emailerror:`${email_errorlist[0]}`,passerror:" "});
        console.log("Routine Finished: Error");
    }
});

function lettersnamecheck(name){
    var nameerror = ["Username Ok"];
    if(!(/^[a-zA-Z0-9]+$/.test(name))){
        console.log("contains non letter");
        nameerror.unshift("Invalid Input, name must only contain letters and numbers");
    }

    return nameerror;
}

function emailcheckpromise(email){
    let sql = 'SELECT COUNT(Email) FROM members WHERE Email = (?)';
    //wrap up in response
    return new Promise((resolve, reject) => {
        db.get(sql, [email],(err, result)=>{
            //console.log("getting");
            if(err){
                reject(new Error(err.message));
            }
            else{
                resolve(result["COUNT(Email)"]);
            }
        })
    }) 
}

function namecheckpromise(name){
    let sql = 'SELECT COUNT(Name) FROM members WHERE Name = (?)';
    //wrap up in response
    return new Promise((resolve, reject) => {
        db.get(sql, [name],(err, result)=>{
            //console.log("getting");
            if(err){
                reject(new Error(err.message));
            }
            else{
                resolve(result["COUNT(Name)"]);
            }
        })
    }) 
}

function insertMember(sql, params,name_errorlist,email_errorlist){
    return new Promise((resolve, reject) =>{
        db.run(sql, params, function(err) {
            console.log("running");
            if (err) {
                reject({nameerror:" ",emailerror:"Error inserting into database"}); 

            }
            else{
                resolve({nameerror:`${name_errorlist[0]}`,emailerror:`${email_errorlist[0]}`}); 
            }
        })
    })
}

function getid(){
    return new Promise((resolve, reject) =>{
        db.get("SELECT last_insert_rowid()",[], (err, result) =>{
            if(err){
                reject(new Error(err.message));
            }
            else{
                resolve(result);
            }
        })

    })
}

function insertpassword(keyparams){
    let placeholders = keyparams.map((param) => '?').join(',');
    let passwordsql = 'INSERT INTO passwords (Mem_ID, DerivedKey, Nonce, Iterations, Bytes, Digest) VALUES ' + `(${placeholders})`;
    return new Promise((resolve, reject) => {
        db.get(passwordsql, keyparams,(err, result)=>{
            //console.log("getting");
            if(err){
                reject({passerror:"Error inserting into database"});
            }
            else{
                resolve({passerror:"Password OK"});
            }
        })
    }) 
}

function encrypt(password){
    var salt = crypto.randomBytes(16);
    var iterations = 80000;
    var bytes = 32;
    var digest = 'sha256'
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations,bytes, digest, (err, derivedKey) => {
            if (err){
                reject(new Error(err.message));
            }
            else{
                resolve([derivedKey.toString('hex'),salt,iterations,bytes,digest]);
            }
        })
    })
    
}



module.exports = {
    handler: dbhandler,
    dbconn : db
}