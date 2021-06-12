const admin = require('firebase-admin');
const path = require('path');
const { firebaseInit } = require('./firebaseInit');

async function uploadImage(imagePath) {
  firebaseInit();
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
