const Jimp = require('jimp');

const path = require('path');
const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const { nextSlice, imageWidth, index } = workerData;

async function embedImage() {
  try {
    
 
  
  for (let p of nextSlice) {
    const data = fs.readFileSync(p);
    const dataObject = JSON.parse(data);
    const embeddedDataObject = await Promise.all(
      dataObject.filter(d => d.image.optsrc !== null).map(async (d, i) => {
        const { image: { optsrc } } = d;
     
        const filename = path.basename(optsrc);
        const imagePath = `${process.cwd()}/page-image-blurred/${process.env.projectName}/${imageWidth}/${filename}`;
   
        const relDirName =path.dirname(p.substring(p.indexOf(process.env.projectName))).split('/').filter((f,i)=> i>0).map(()=> '..').join('/')
        
        const relativeImagepath =relDirName +`/${process.env.projectName}/${imageWidth}/`+filename

        if (fs.existsSync(imagePath)) {
       
          const image = await Jimp.read(imagePath);
        
          const dataURL = await image.getBase64Async(Jimp.AUTO);

          const dataSrcset = relativeImagepath;
          const nextState = {
            ...d,
            image: {
              ...d.image,
              src: `${dataURL}`,
              dataSrcset
            }
          };
          return nextState;
        } else {
          
          return d;
        }
      })
    )
    console.log(
      `image embeded wt is :${index} total:${dataObject.length} file${p}`
    );
    fs.writeFileSync(p, JSON.stringify(embeddedDataObject));
  }
  parentPort.postMessage(`Images are processed`);
} catch (error) {
    
}
}

embedImage();
