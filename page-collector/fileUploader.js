const admin = require('firebase-admin');
const path = require('path');


async function fileUploader({output,cb}) {
  try {
    const fileName = path.basename(output);
    const filePath = output;
  
  
    const bucket = admin.storage().bucket();
  
    await bucket.upload(filePath, {
      destination: fileName
    });
    console.log('file upload succeful')
    cb()
  } catch (error) {
    console.log('file upload failed')
    throw error
  }

}

module.exports = {
  fileUploader
};
