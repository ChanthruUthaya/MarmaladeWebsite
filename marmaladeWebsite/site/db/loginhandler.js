const express = require('express');
const dbhandler = express.Router();
const crypto = require('crypto');
var cookie = require('cookie');
const db = require('../config/db-config.js').userdb;
const sessdb = require('../config/db-config.js').sessiondb;
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
const sqlite3 = require('sqlite3');
const { v4: uuidv4 } = require('uuid');



// let sessdb = new sqlite3.Database('./db/sessions.db',(err) => {
//     if(err) {
//         console.log(err.message);
//     }
//     console.log('connected to session database');
// });

const time = 5*60*1000;

const sessionStore = new SQLiteStore({
    table:'sessiontable',
    db:'sessions.db',
    dir: './db'
});

var sessionMiddleware = session({
    store: sessionStore,
    genid: function(req) {
        req.sid = uuidv4();
        console.log(`sid is : ${req.sid} 1`);
        return req.sid; // use UUIDs for session IDs
      },
    secret: "yhsure",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: time,
        httpOnly:false
        }
    });

dbhandler.post('/', async (req,res,next) =>{
    req.send_messages = [];
    let sqlpass = 'SELECT * FROM passwords WHERE Mem_ID = (?)';
    const obj = JSON.parse(JSON.stringify(req.body));
    console.log(obj);
    var errors = {idfound:false,passfound:false};
    let sqlid = 'SELECT ID FROM members WHERE Email = (?)';
    let id = await get([obj.email.toLowerCase()],sqlid).then(
        (result) =>{
            if(result === undefined){ 
                console.log("undefined");
            }
            else{
                errors['idfound'] = true
                req.userid = result.ID;
                return result;
            }
        }
    ).catch((err) =>{
        
        console.log(err)
    });
    if(errors['idfound']){
        let pd = await get([id.ID], sqlpass).then((result) =>{
                if(result === undefined){ 
                    console.log("undefined");
                }
                else{
                    errors['passfound'] = true;
                    return result;
                }
        }).catch((err) =>{
            console.log(err);
        });
        if(errors['passfound']){
            console.log(pd);
            let derKey = pd.DerivedKey;
            console.log(typeof pd.Nonce);
            let encryption = await encrypt(obj.password, pd.Nonce, pd.Iterations, pd.Bytes, pd.Digest).catch((err) => console.log(err));
            if(derKey === encryption){
                console.log("succesful")
                req.siteauth = true;
                req.send_messages.push({message:"Sign in successful"});
            }
            else{
                req.send_messages.push({message:"Password Incorrect"});
            }
        }
        else{
            req.send_messages.push({message:"error"});
        }
    }
    else{
        req.send_messages.push({message:"Email not found"});
    }
    console.log("made it to next");
    if(req.siteauth === undefined){
        req.siteauth = false;
    }
    next();
})

dbhandler.use(async (req, res, next) => {
    if(req.siteauth && req.authenticated.auth == false){
        console.log("starting session");
        await new Promise((resolve)=>{
            sessionMiddleware(req,res,next);
            setTimeout(() => {
                resolve("session inserted");
              }, 2000);
        }
        ).then((result)=> console.log(result));
        console.log(`sid is : ${typeof req.sid} 2`);
        var params = [req.sid,req.userid];
        let placeholders = params.map((param) => '?').join(',');
        let sql = 'INSERT INTO sessionmap (sid, PID) VALUES ' + `(${placeholders})`;
        await insertSession(sql, params).then(result => console.log(result)).catch(err => console.log(err.message));
        }
    else if(req.siteauth && req.authenticated.auth == true){
        console.log(`logged in: ${req.cookies["connect.sid"]}`);
        req.send_messages.unshift({message:"Already Logged in"});
    }
    next();
    }
  )

dbhandler.use((req, res) => {
    res.json(req.send_messages[0]); 
})

/*TODO

        await new Promise((resolve, reject) =>{
            req.session.save((err)=>{
                if (err){
                    reject(new Error(err.message));
                }
                else{
                    resolve("inserted into sessiontable");
                }
            })
        }).then((result)=> console.log(result)).catch((err)=>console.log(err.message));
        req.session.set = true;

verify login details
give cookie
certificates?

         res.setHeader('Set-Cookie', cookie.serialize('connect.sid',req.sid,{
            httpOnly: false,
            maxAge: time
        }));
*/

function get(item,sql){
    return new Promise((resolve, reject) => {
        db.get(sql, item, (err, result) => {
            if(err){
                reject(new Error(err.message))
            }
            else{
                resolve(result);
                //console.log(result);
            }
        })

    })

}

function encrypt(password, salt, iterations, bytes, digest){
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations,bytes, digest, (err, derivedKey) => {
            if (err){
                reject(new Error(err.message));
            }
            else{
                resolve(derivedKey.toString('hex'));
            }
        })
    })
    
}

function insertSession(sql, params){
    return new Promise((resolve, reject) =>{
        sessdb.run(sql, params, function(err) {
            console.log("running");
            if (err) {
                reject(new Error(err.message)); 

            }
            else{
                resolve("Succesfully inserted"); 
            }
        })
    })
}

module.exports = dbhandler;


