const express = require('express');
const uphandler = express.Router();
const multer = require('multer');
const userdb = require('../../config/db-config.js').userdb;

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./db/uploads");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //accept
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }
    else{
    //reject 
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
    }
}

const upload = multer({
    storage:storage,
    limits: {
        fileSize: 5*1024*1024,
        files: 1
    },
    fileFilter: fileFilter
}).single('uploadImage');

const errors = {
    'LIMIT_FILE_SIZE': "File too big",
    'LIMIT_FILE_COUNT': "Only allowed to upload 1 file",
    'LIMIT_UNEXPECTED_FILE' : "Only allowed Jpeg and Png images"
}



uphandler.post('/',(req, res) => {
    upload(req, res, async function(err){
        if(err){
            if(err instanceof multer.MulterError){
                res.send(errors[err.code]);
            }
            else {
                res.send("upload error");
            }
        }
        else{
            if(req.authenticated.auth){
                console.log(`id is ${req.authenticated.id}`);
                console.log(`path is ${req.file.path}`);
                var params = [req.authenticated.id,req.file.path];
                let placeholders = params.map((param) => '?').join(',');
                let sql = 'INSERT INTO photos (Mem_ID, Path) VALUES' + `(${placeholders})`;
                await insert(sql, params).then(result => console.log(result)).catch(err => console.log(err.message));
            }
            res.redirect('/upload/image/success');
            console.log(req.file);
        }
    })
})


//maybe push to another route to avoid re-auth
uphandler.use('/success',(req,res) => {
    //console.log("shouldnt be here");
    res.redirect('/profile');
})


function insert(sql, params){
    return new Promise((resolve, reject) =>{
        userdb.run(sql, params, function(err) {
            console.log("running");
            if (err) {
                reject(new Error(err.message)); 

            }
            else{
                resolve("inserted photo path"); 
            }
        })
    })
}

module.exports = uphandler;