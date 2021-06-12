const admin = require('firebase-admin');

var serviceAccount = require('/Users/personalcomputer/actors/turkmenistan-market-firebase-adminsdk-k72dr-79c2d91886.json');

function firebaseInit() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), //admin.credential.applicationDefault(),
    storageBucket: 'gs://turkmenistan-market.appspot.com',
    databaseURL: 'https://turkmenistan-market.firebaseio.com'
  });
  const database = admin.database();
 
  return { admin, database };
}

module.exports = { firebaseInit };
