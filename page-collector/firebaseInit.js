const admin = require('firebase-admin');

//var publicServiceAccountInfo = require('../turkmenistan-market-74b0fe0d7246.json');


function firebaseInit() {
  try {
    if(process.env.LOCAL){
      var service = require('../turkmenistan-market-74b0fe0d7246.json'); 
      admin.initializeApp({
        credential:  admin.credential.cert(service), //admin.credential.applicationDefault(),
        storageBucket: 'gs://turkmenistan-market.appspot.com',
        databaseURL: 'https://turkmenistan-market.firebaseio.com'
      });
    } else{
      admin.initializeApp({
        credential:  admin.credential.cert(JSON.parse(process.env.PRIVATE_KEY)), //admin.credential.applicationDefault(),
        storageBucket: 'gs://turkmenistan-market.appspot.com',
        databaseURL: 'https://turkmenistan-market.firebaseio.com'
      });
    }
 
    
    const database = admin.database();
  
    return { admin, database };
  } catch (error) {
    console.log('error________',error)
    return null
  }
 
}

module.exports = { firebaseInit };
