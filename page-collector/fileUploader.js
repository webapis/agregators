const admin = require('firebase-admin');


const path = require('path')
async function fileUploader({ output, cb,database }) {
  try {
    const fileName = path.basename(output);
    const filePath = output;
    const datetimefolder = Date.now()
    const projectName =fileName.replace('.json','')
    const uploadPath =projectName  + '/' + datetimefolder + '/'+fileName
    console.log('uploadPath',uploadPath)
    debugger;
    const bucket = admin.storage().bucket();

    await bucket.upload(filePath, {
      destination: uploadPath
    });

const collectionsRef=  admin.database().ref(`collections/${projectName}/${datetimefolder}`)
console.log('file upload succeful')
await collectionsRef.set({uploadPath})
  const projectsRef =  admin.database().ref(`projects/${projectName}`)
  
  await  projectsRef.update({
      uploadPath
    });

    cb()
  } catch (error) {
    console.log('file upload failed')
    throw error
  }

}

module.exports = {
  fileUploader
};
