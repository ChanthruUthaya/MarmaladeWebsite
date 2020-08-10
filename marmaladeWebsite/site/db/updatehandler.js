const express = require('express');
const updatehandler = express.Router();
const db = require('../config/db-config.js').userdb;


let namechecker = async function namecheck(name){
    let name_count = await namecheckpromise(name).then((count)=>{
        return count;
    }).catch((err)=>{console.log(err.message)});
    if(name_count > 0){
        return "Userame already exists";
    }
    else{
        return "OK";
    }
}

let emailchecker = async function emailcheck(email){
    let email_count = await emailcheckpromise(email.toLowerCase()).then((count) => {
        return count;
    }).catch((err) =>(console.log(err.message)));
    if(email_count > 0){
        return "Email already in use";
    }
    else{
        return "OK";
    }
}

var functionmap = {
    name : namechecker,
    email : emailchecker
}

var sqloptions = {
    nameemail : "UPDATE members SET Name = (?), Email = (?) WHERE ID = (?)",
    name: "UPDATE members SET Name = (?) WHERE ID = (?)",
    email : "UPDATE members SET Email = (?) WHERE ID = (?)"
}


updatehandler.put('/', async (req, res) =>{
    if(req.authenticated.auth){
        const obj = JSON.parse(JSON.stringify(req.body));
        var errors = {
        }
        var sqloptstr = "";
        for(var key in obj){
            if(functionmap.hasOwnProperty(key)){
                sqloptstr += key;
                errors[key] = await functionmap[key](obj[key]);
            }
            else{
                errors.generic = "submission error";
            }
        }
        console.log(`update errors: ${JSON.stringify(errors)}`);
        if(errorcheck(errors)){
            var sql = undefined
            if(sqloptions.hasOwnProperty(sqloptstr)){
                sql = sqloptions[sqloptstr];
            }
            if(sql != undefined){
                var params = generateParams(obj,req);
                let update = await new Promise((resolve, reject) =>{
                    db.run(sql, params, (err) =>{
                        if(err){
                            reject(new Error(err.message));
                        }
                        else{
                            resolve("Successfully updated details");
                        }
                    })
                }).then((result) =>{
                    return result;
                }).catch((err) => console.log(err.message));
                res.status(200).json({error:false, message:update});
            }
        }
        else{
            response = {
                error:true
            }
            for(key in errors){
                response[key] = errors[key];
            }
            res.json(response);
        }
    }
    else{
        res.redirect('/unauthorized');
    }

});

function generateParams(obj, req){
    var params = [];
    for(key in obj){
        params.push(obj[key]);
    }
    params.push(req.authenticated.id);
    return params;
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

function errorcheck(errors){
    var allok = true;
    for(key in errors){
        if(errors[key] != "OK"){
            allok = false;
        }
    }
    return allok;
}


module.exports = updatehandler;