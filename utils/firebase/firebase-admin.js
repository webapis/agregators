
require('dotenv').config()
const admin = require('firebase-admin');

if (process.env.LOCAL) {

    var service = require('../../gol74b0fe0d7246.json');
    admin.initializeApp({
        credential: admin.credential.cert(service),
        databaseURL: process.env.databaseURL
    });
} else if(process.env.HEROKU==='YES') {

    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.PRIVATE_KEY)),
        databaseURL: process.env.databaseURL
    });
}




module.exports = { admin }

