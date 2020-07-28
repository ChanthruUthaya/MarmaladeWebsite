
const sessdb = require('../../config/db-config.js').sessiondb;

async function authenticate_cookie(req, res, next) {
    var cookie = req.cookies["connect.sid"];
    if(typeof cookie != "undefined"){
        var cookie_parse = cookie.split(":")[1].split(".")[0];
        console.log(cookie_parse);
        let data = await new Promise((resolve, reject)=>{
            let sql = "SELECT * FROM sessiontable WHERE sid = (?)";
            let params = [cookie_parse];
            sessdb.get(sql,params, (err, result) => {
                if(err){
                    reject("in Authentication: Invalid cookie");
                }
                else{
                    resolve(result);
                }
            })
        }).then((result) => {
            console.log("in Authentication: found user to authenticate");
            return result;
        }).catch((reason) => console.log(reason));
        console.log(`in Authentication: data ${JSON.stringify(data)}`);
        if(data != undefined){
            if(data.sid === cookie_parse){
                req.authenticated = {auth:true, cookie:cookie_parse};
            }
            else{
                req.authenticated = {auth:false};
            }
        }
        else{
            console.log("in Authentication: it was undefined");
            req.authenticated = {auth:false};
        }
    }
    else{
        req.authenticated = {auth:false};
    }
    next();
}

async function findId(req, res, next){
    if(req.authenticated.auth){
        await new Promise((resolve, reject)=>{
            let sql = "SELECT * FROM sessionmap WHERE sid = (?)";
            let params = [req.authenticated.cookie];
            sessdb.get(sql,params, (err, result) => {
                if(err){
                    reject("in Authentication: No User");
                }
                else{
                    resolve(result);
                }
            })
        }).then((result) => {
            console.log("in Authentication: found user ID");
            req.authenticated.id = result.PID;
        }).catch((reason) => console.log(reason));
    }
    next();
}

module.exports = {authcookie:authenticate_cookie, id:findId}