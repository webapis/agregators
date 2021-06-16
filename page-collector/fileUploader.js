const admin = require('firebase-admin');
const path = require('path');
const { firebaseInit } = require('./firebaseInit');

async function fileUploader({output,cb}) {
  debugger;
  firebaseInit();
  const fileName = path.basename(output);
  const filePath = output;
  const destFileName = output.replace(process.cwd() + '/', ''); //`images/${fileName}`;
  
  const bucket = admin.storage().bucket();
  await bucket.upload(filePath, {
    destination: destFileName
  });
}

module.exports = {
  fileUploader
};
