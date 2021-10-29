
require('dotenv').config()
const admin = require('firebase-admin');

if (process.env.LOCAL) {

    var service = require('./turkmenistan-market-firebase-adminsdk-d0s1d-7289a84f0e.json');
    admin.initializeApp({
        credential: admin.credential.cert(service),
        databaseURL: process.env.databaseURL
    });
} else {

    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.PRIVATE_KEY)),
        databaseURL: process.env.databaseURL
    });
} 


module.exports = { admin }

