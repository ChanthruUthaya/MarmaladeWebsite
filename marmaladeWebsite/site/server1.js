const express = require('express');
const path = require('path');
const app = express();
const sqlite3 = require('sqlite3');
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 8080;
var authmiddleware = require('./routes/authentication/authmiddleware.js');


//auth middleware here, add authentication status to req body.
//check cookie attach auth bool to req
//if auth check id and attach to req body 

//Body Parser Middleware
app.use(express.json()); //handle raw JSON
app.use(express.urlencoded({extended: false})); //handle url encoded data
app.use(cookieParser()); //allow cookie parsing

app.use(express.static(path.join(__dirname, 'public'))); //static page serving Use to include middleware 'public' is static folder
app.use(express.static(path.join(__dirname, 'db/uploads')));//static folder for image uploads

app.use('/signup', require('./db/signuphandler').handler); // route to database handler
app.use('/login', authmiddleware.authcookie, authmiddleware.id, require('./db/loginhandler.js')); //route to login handler


//profile middleware with cookie authentication
app.use('/profile', authmiddleware.authcookie, authmiddleware.id, (req, res)=>{
        if(req.authenticated.auth){
            console.log("profile request");
            res.status(200).sendFile(path.join(__dirname, 'protected/profile.html'));
        }
        else{
            res.redirect('/unauthorized');
        }
    },
);

//unauthorized redirect
app.use("/unauthorized", (req, res) => {
    res.redirect('/index.html');
})

//logout
app.use('/logout',authmiddleware.authcookie, authmiddleware.id, require("./db/logouthandler.js"));

//get all photos by a user
app.use('/getdata', authmiddleware.authcookie, authmiddleware.id,require('./routes/pictureapi/pictureapi.js'));

//delete image
app.use('/delete', authmiddleware.authcookie, authmiddleware.id,require('./db/deleteimagehandler.js'));

//authenticate cookie
app.get('/authenticate',authmiddleware.authcookie, authmiddleware.id, (req, res) => {
    if (req.authenticated.auth){
        res.json({msg:"authenticated"});
    }
    else{
        res.json({msg:"false"});
    }
});

//upload photo
app.use('/upload',authmiddleware.authcookie, authmiddleware.id,require("./routes/uploadhandler/uploadhandler.js"));

app.use('/updatepage', authmiddleware.authcookie, authmiddleware.id, (req, res) =>{
    if(req.authenticated.auth){
        res.status(200).sendFile(path.join(__dirname,'protected/updateuser.html'));
    }
    else{
        res.redirect('/unauthorized');
    }
})

app.use('/updatedetails',authmiddleware.authcookie, authmiddleware.id, require("./db/updatehandler.js"));

//404 redirect 
app.get('*', (req, res) => {
    res.status(404).send("Could not find page");
})


app.listen(PORT, () => console.log("listening on port: " + PORT));
//accept="image/*"

/*
profile
(req, res) =>{
    console.log(`auth: ${JSON.stringify(req.authenticated.auth)}`);
    if(req.authenticated.auth){
        res.sendFile(path.join(__dirname + '/protected/profile.html' ));
    }
    else{
        res.redirect("/unauthorized");
    }
}

*/