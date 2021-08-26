
require('dotenv').config()
const admin = require('firebase-admin');

//var publicServiceAccountInfo = require('../turkmenistan-market-74b0fe0d7246.json');
if (process.env.LOCAL) {

    var service = require('../../turkmenistan-market-74b0fe0d7246.json');
    admin.initializeApp({
        credential: admin.credential.cert(service), //admin.credential.applicationDefault(),
        storageBucket: 'gs://turkmenistan-market.appspot.com',
        databaseURL: 'https://turkmenistan-market.firebaseio.com'
    });
} else {

    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.PRIVATE_KEY)), //admin.credential.applicationDefault(),
        storageBucket: 'gs://turkmenistan-market.appspot.com',
        databaseURL: 'https://turkmenistan-market.firebaseio.com'
    });
}

function createFirebaseCustomToken(uid, res) {
    admin
        .auth()
        .createCustomToken(uid)
        .then((customToken) => {
         
            admin.database().ref(`users/${uid}`).update({ fb_custom_tkn: customToken }, (error) => {
                if (error) {
                    debugger;
                    console.log('error', error)
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('firebase Error');
                } else {
                    debugger;
                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode = 200
                    res.end(JSON.stringify({ fb_custom_tkn: customToken }));
                }
            })
        })
        .catch((error) => {
            console.log('Error creating custom token:', error);
            console.log('error', error)
            res.setHeader('Content-Type', 'text/plain');
            res.end('Server Error');
        });
}


module.exports = { createFirebaseCustomToken, admin }

//REFRESH CUSTOM TOKEN
//https://firebase.google.com/docs/reference/rest/auth/#section-verify-custom-token