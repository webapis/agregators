require('dotenv').config()
const admin = require('firebase-admin');

//var publicServiceAccountInfo = require('../turkmenistan-market-74b0fe0d7246.json');
if(process.env.LOCAL){
  debugger;
  var service = require('../turkmenistan-market-74b0fe0d7246.json'); 
  admin.initializeApp({
    credential:  admin.credential.cert(service), //admin.credential.applicationDefault(),
    storageBucket: 'gs://turkmenistan-market.appspot.com',
    databaseURL: 'https://turkmenistan-market.firebaseio.com'
  });
} else{
  debugger;
  admin.initializeApp({
    credential:  admin.credential.cert(JSON.parse(process.env.PRIVATE_KEY)), //admin.credential.applicationDefault(),
    storageBucket: 'gs://turkmenistan-market.appspot.com',
    databaseURL: 'https://turkmenistan-market.firebaseio.com'
  });
}
const fbDatabase = admin.database();
function firebaseInit() {



    
  
  
   // return { admin, database };

 
}

module.exports = { firebaseInit,fbDatabase };
