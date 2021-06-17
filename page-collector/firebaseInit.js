const admin = require('firebase-admin');

var publicServiceAccountInfo = require('../turkmenistan-market-74b0fe0d7246.json');
const serviceAccount = { ...publicServiceAccountInfo, private_key_id: process.env.PRIVATE_KEY_ID, private_key: process.env.PRIVATE_KEY }
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
