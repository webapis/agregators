require('dotenv').config()



const fs = require('fs'); 
const { projects } = require('./project.config');

const { walkSync } = require('./walkSync');
const { removeDerectory } = require('./removeDerectory');
const path = require('path');
const { taskSequelizer } = require('./task-sequelizer')

const makeDir = require('make-dir');


const { pageGeneration } = require('./pageGenerator');
const { pageScriptAttacher } = require('./pageScriptAttacher');
const { pageComponentAttacher } = require('./pageComponentAttacher');
const { pageBuilder } = require('./pageBuilder');
const { pageNavigationItems } = require('./pageNavigationItems');

const { batchPageCollector } = require('./batchPageCollector');
const { batchImageCollection } = require('./batchImageCollection');
const { batchImageProcessing } = require('./batchImageProcessing');
const { pageNavDataTreeCreation } = require('./pageNavTreeCreation')
const { pageLeaves } = require('./pageLeaves')



function change() {

  const tasks = projects[process.env.projectName]
  const taskSequelizerEventEmitter = taskSequelizer({ tasks })
  taskSequelizerEventEmitter.on('nextTask', async function (nextTaskName) {

    switch (nextTaskName) {
      case 'page_collection':
        await batchPageCollector({ taskSequelizerEventEmitter, uploadFile: false })
        break;
      case 'page_image_collection':
        await batchImageCollection({ taskSequelizerEventEmitter })
        break;
      case 'page_image_crop':
        batchImageProcessing({
          skipProcessed: true,
          processType: 'crop',
          taskSequelizerEventEmitter,
          imageWidth: 288,
          folderName: 'page-image',
          script:
            '/Users/personalcomputer/actors/page-collector/image-processes/2-cropImages.js'
        })
        break;
      case 'page_image_blur':
        batchImageProcessing({
          skipProcessed: true,
          processType: 'blur',
          taskSequelizerEventEmitter,
          imageWidth: 288,
          folderName: 'page-image-resized',
          script:
            '/Users/personalcomputer/actors/page-collector/image-processes/3-blurImages.js'
        })
        break;
      case 'page_image_embed':
        batchImageProcessing({
          skipProcessed: false,
          processType: 'embed',
          taskSequelizerEventEmitter,
          imageWidth: 288,
          folderName: 'page-data',
          batch: 2,
          script:
            '/Users/personalcomputer/actors/page-collector/image-processes/4-embedImages.js'
        })
        break;
      case 'page_nav_data_tree_creation':
        removeDerectory('page-tree') &&
          pageNavDataTreeCreation({ taskSequelizerEventEmitter })
        break;
      case 'page_leaves_creation':
        removeDerectory('page-leave') &&
          pageLeaves({ taskSequelizerEventEmitter })
        break;
      case 'page_generation':
        removeDerectory('page-list-pages') &&
          pageGeneration({ taskSequelizerEventEmitter })
        break;
      case 'page_component_attacher':
        pageComponentAttacher({
          taskSequelizerEventEmitter,
          source: `
    <product-list></product-list>
    <prerender-component></prerender-component>
    `,
          innterHtmlTo: 'body',
          inputFolder: 'page-list-pages'
        })
        break;
      case 'page_script_attacher':
        pageScriptAttacher({
          taskSequelizerEventEmitter, scripts: [{
            source: [
              'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css'
            ],
            inputFolder: 'page-list-pages',
            prop: 'href',
            tag: 'link',
            appendTo: 'head',
            rel: 'stylesheet',
            cdn: true
          }, {
            source: ['/components/nav.css'],
            inputFolder: 'page-list-pages',
            prop: 'href',
            tag: 'link',
            appendTo: 'head',
            rel: 'stylesheet',
            cdn: false
          }, {
            source: [
              '/components/product-list/product-list.js',
              '/components/product-list/prerender-component.js'
            ],
            inputFolder: 'page-list-pages',
            prop: 'src',
            tag: 'script',
            appendTo: 'body',
            cdn: false
          }]
        })

        break;
      case 'page_nav_items':
        pageNavigationItems({ taskSequelizerEventEmitter })
        break;
      case 'page_builder':
        removeDerectory('page-build') &&
          pageBuilder({ taskSequelizerEventEmitter });
        break;
      default:
        break;
    }



  })



  console.log('nextTask started', process.env.NEXT_TASK)
  taskSequelizerEventEmitter.emit('nextTask', process.env.NEXT_TASK)

}

change()

// function genGbp(){
//   
//       const buf = Buffer.from("-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvf2Up7Sv7OLJj\niBH1lvesLJ3PUgbCqk8HnCu/ZLUR4e9jn2FECQodFHfg8R/3T96gykMeKtR5+xPB\nft21JD0Q+7Os6/izhKheSkaqPu0CKz4RjtcpkdAROWpLe4wV9kJSedFZIen6/Ufh\nOeHmEZNZIKzcpRcwiPB4LGWcL5FMRmPgUhjYlOvn4G3BOP+p1L9/sJ5xkp8Rvisu\nPsGw2n1FlZ7qtjDF46QvZjgVhO7PmMcR+e8IfKBwm0s+pKjFy3onNvVfrOLoNRvj\nRQPJ0u2tdS8Ox6sONV2dRch6BpUcAOLitShV9qqhiJVfcUdGtI3iMWBTs+kPrXt9\n93DjvLEVAgMBAAECggEABXnnMTi6X5t0TZDIZq5wSgoWXorDtT1VO/qOjulYkRdI\nvgYSJepWS3QBDZ7YjYILg17sWzug57GC+023I1jfIvGHuMSgPRHNoyuUKunNwXyR\n8kBPzHdFU9RD0dkoFONbTHGKq8pYH8HZhVimCOTRgT14x2XLZHNRdZ6FCSue0A9w\n/8BSTH33sQvj6P9S47fwpbxPLQt8ap/HkxbUa5dBiXUvSI1DgCx/a1IRvVProsUC\nA+4Iwc1B88taqc3IzDvwFfqNeiEPKylz1bcgkNpInNpdUMD24MTdZdOxSqVIXIl6\nf1PUT3VHwQLZ6VtkkoqYHXfofkUD3awXB6NqU0LjoQKBgQDb0HiEbdI2ldKQroMH\nvPRpK+fj2O9mVm23jv1OzcGuhMKNY7Qax2EC1mTCZza1xI4vIGDff35eb/7KK3D7\nSoyCukb7L1jF6biqs8H55lZ9oD2oVuZevRaY+CUttIT5pDEMY3hxJ2k8HtZoOBBK\n4Ko54BMZD8qM3pDdGw1hyCkV/QKBgQDMY06etJXeoRjimGCbiOBKmcRbycB07l1S\nFuFejgNClWuzDAJ0c+625ucJ2SksUC/s02wot69MQsuED0PgTbZZ9I5nA1ISs4x3\nTG8ZafOt4AdPP0sfyPPvPvdnh3f3oCQU/OFghNrkxbfxynRl77igXL+E9VuitY+z\nE137vqnm+QKBgQCwzVBybAbeAsn3t3YK/k+0XC1LVczRCol7UBaskNDNN1lo8h4G\nQAHmj11CBFS8BRm8DBX/DoQtH3XXVPOuG7tC1uOK2/1SSvhOzQEjqMI+j2mogiUP\nZJXNeiIlTgJ67TbKWSOiF+oMAl3AO//WyjgBDxstWEc54TaxsTWlRaLOXQKBgDrT\nznoxgf1tIst9jjjWIbB3J6Q/ooxFW0jYWw+rElckyLXlHAPGpouwVAlqnsYpYlHo\n3HWvwN3TT953wlKaK4UitaYCt6m4UhK4RjXrX/7Iv3HYxtekMEnJNs5umGIGjrwX\nuQrd0l8MZZBLdEsuv1Ywu9MaB8ECPxUM2v0teJuJAoGAWpK8W6wsaMev9mqKTQYT\nhWoXHvwc3DCzZUOe9lA4SROOmiMktlxTJkMgg5JMQm7X5ytv0MTFUZbDe0o1Qy08\nORua7YU1puoSfp4GSJ+LxaodV+8i4ll2O1kGsZBq7qVHV+wZDXJgOZVic447Nj/E\nDYtSCqflhioKs64rw4uDN7Q=\n-----END PRIVATE KEY-----\n")
//       const opt = { debug: false }
//       const config = dotenv.parse(buf, opt)
//       
//       console.log('conf',config)
//       
//   }
  
//   genGbp()
// projects[process.env.projectName]['page_nav_items'] && pageNavigationItems();
// projects[process.env.projectName]['page_builder'] &&
//   removeDerectory('page-build') &&
//   pageBuilder();

// firebase deploy --only hosting:monitor
