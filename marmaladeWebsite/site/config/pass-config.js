const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db-config.js').userdb;
const sessdb = require('./db-config.js').sessiondb;


const customFields = {
    usernameField: 'uname',
    passwordField: 'pw'
};



const verifyCallback = (username, password, done) => {

   

}

const strategy  = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    
});