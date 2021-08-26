require('dotenv').config()




let fbDatabase = null;

if (process.env.SERVER === 'GITHUB_ACTION') {
  debugger;
  var firebaseConfig = {
    apiKey: "AIzaSyDb8Z27Ut0WJ-RH7Exi454Bpit9lbARJeA",
    authDomain: "turkmenistan-market.firebaseapp.com",
    databaseURL: "https://turkmenistan-market.firebaseio.com",
    projectId: "turkmenistan-market",
    storageBucket: "turkmenistan-market.appspot.com",
    messagingSenderId: "117708549296",
    appId: "1:117708549296:web:7e0b59b9a61acdec261f75"
  };
  const firebase = require('firebase/app').default;
  require('firebase/auth');
  require('firebase/database');

  const app = firebase.initializeApp(firebaseConfig);

  fbDatabase = app.database()
} else {
  debugger;
  const { admin } = require('./firebase-admin')
  fbDatabase = admin.database()
}

module.exports = { fbDatabase };








/*
require('dotenv').config()
const admin = require('firebase-admin');

//var publicServiceAccountInfo = require('../turkmenistan-market-74b0fe0d7246.json');
if(process.env.LOCAL){

  var service = require('../../turkmenistan-market-74b0fe0d7246.json');
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
const fbDatabase = admin.database();
function firebaseInit() {






   // return { admin, database };


}

module.exports = { firebaseInit,fbDatabase };

*/