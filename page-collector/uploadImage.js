const admin = require('firebase-admin');
const path = require('path');
var serviceAccount = require('/Users/personalcomputer/actors/turkmenistan-market-firebase-adminsdk-k72dr-79c2d91886.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), //admin.credential.applicationDefault(),
  storageBucket: 'gs://turkmenistan-market.appspot.com',
  databaseURL: 'https://turkmenistan-market.firebaseio.com'
});

async function uploadImage(imagePath) {
  const fileName = path.basename(imagePath);
  const filePath = imagePath;
  const destFileName = imagePath.replace(process.cwd() + '/', ''); //`images/${fileName}`;
  debugger;
  const bucket = admin.storage().bucket();
  await bucket.upload(filePath, {
    destination: destFileName
  });
}

module.exports = {
  uploadImage
};
