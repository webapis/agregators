const admin = require('firebase-admin');

var publicServiceAccountInfo = require('../turkmenistan-market-c7b14b0e2da4.json');
const serviceAccount = { ...publicServiceAccountInfo, private_key_id: process.env.private_key_id, private_key: process.env.private_key }
debugger;
function firebaseInit() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), //admin.credential.applicationDefault(),
    storageBucket: 'gs://turkmenistan-market.appspot.com',
    databaseURL: 'https://turkmenistan-market.firebaseio.com'
  });
  debugger;
  const database = admin.database();

  return { admin, database };
}

module.exports = { firebaseInit };
