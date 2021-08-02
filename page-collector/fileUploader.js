const admin = require('firebase-admin');


const path = require('path')
async function fileUploader({ output, cb,database }) {
  try {
    const datetimefolder = Date.now()
    const fileName =path.basename(output)
    const changedoutput =output.replace(`${fileName}`,`excel/${fileName.replace('.json','.xlsx')}`)
    
    await uploadFileByExtention({ext:'.xlsx',output:changedoutput,datetimefolder,cb})

  } catch (error) {
    console.log('file upload failed',error)
    throw error
  }

}

module.exports = {
  fileUploader
};


async function uploadFileByExtention({ext,output,datetimefolder,cb}){
  try {
    const end =   Date.now()
    
    const savePath =ext.replace('.','')
    const fileName = path.basename(output);
    const filePath = output.replace('.json',ext);
  
    const projectName =fileName.replace(ext,'')
    const uploadPath =projectName  + '/' + datetimefolder + '/'+fileName.replace('.json',ext);
    console.log('uploadPath',uploadPath)
    const bucket = admin.storage().bucket();
    await bucket.upload(filePath, {
      destination: uploadPath
    });
const collectionsRef=  admin.database().ref(`collections/${projectName}/${datetimefolder}`)
console.log('file upload succeful')
  const projectsRef =  admin.database().ref(`projects/${projectName}`)
  projectsRef.on('value',async (snapshot)=>{
    const {start} =snapshot.val()
    await  projectsRef.update({
      [savePath]:uploadPath,
      end
       });
       await collectionsRef.update({  [savePath]:uploadPath,end,start},(error)=>{
       })
       cb()
  })
  

  
  } catch (error) {
    console.log('file upload failed')
    throw error
  }
}