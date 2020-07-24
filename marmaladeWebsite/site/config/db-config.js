const sqlite3 = require('sqlite3');

let db = new sqlite3.Database('./db/marmalade.db',(err) => {
    if(err) {
        console.log(err.message);
    }
    console.log('connected to user database');
});


let sessdb = new sqlite3.Database('./db/sessions.db',(err) => {
    if(err) {
        console.log(err.message);
    }
    console.log('connected to session database');
});

module.exports = {sessiondb: sessdb, userdb:db};