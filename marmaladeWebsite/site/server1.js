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
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public'))); //static page serving Use to include middleware 'public' is static folder

app.use('/api/members', require('./routes/api/member')); //api router

app.use('/signup', require('./db/signuphandler').handler); // route to database handler
app.use('/login', authmiddleware.authcookie, authmiddleware.id, require('./db/loginhandler.js'));
app.use('/profile', authmiddleware.authcookie, authmiddleware.id, (req, res) =>{
    console.log(`auth: ${JSON.stringify(req.authenticated.auth)}`);
    if(req.authenticated.auth){
        res.sendFile(path.join(__dirname + '/protected/profile.html' ));
    }
    else{
        res.redirect("/unauthorized");
    }
})
app.use("/unauthorized", (req, res) => {
    res.send("Not Logged In");
})

//need a logout route 

app.use('/logout',authmiddleware.authcookie, authmiddleware.id, require("./db/logouthandler.js"));

app.get("/upload",authmiddleware.authcookie, authmiddleware.id,(req, res)=>{
    if(req.authenticated.auth){
        res.set('Content-Type', 'text/html');
        res.send(Buffer.from(`
        <form method="post" enctype="multipart/form-data" action="/upload/image">
            <input type="file" name="uploadImage">
            <input type="submit" value="Submit">
        </form>`));
    }
    else{
        res.set('Content-Type', 'text/html');
        res.send(Buffer.from(`
        <form action="/login.html">
            <input type="submit" value="Login" />
        </form>`))
    }
})

app.get('/authenticate',authmiddleware.authcookie, authmiddleware.id, (req, res) => {
    if (req.authenticated.auth){
        res.json({msg:"authenticated"});
    }
    else{
        res.json({msg:"false"});
    }
});

app.use('/upload/image',authmiddleware.authcookie, authmiddleware.id,require("./routes/uploadhandler/uploadhandler.js"));

app.get('*', (req, res) => {
    res.status(404).send("Could not find page");
})

app.listen(PORT, () => console.log("listening on port: " + PORT));
//accept="image/*"