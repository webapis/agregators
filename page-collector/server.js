


function change() {
  require('dotenv').config()

  console.log('parameters...', process.env.parameters)
  const { firebaseEvetEmitter } = require('../utils/firebase/firebaseEventEmitter')
  const { projects } = require('./project.config');
  const { removeDerectory } = require('./removeDerectory');
  const { taskSequelizer } = require('./task-sequelizer')
  const { pageGeneration } = require('./pageGenerator');
  const { pageBuilder } = require('./pageBuilder');
  const { pageNavigationItems } = require('./pageNavigationItems');
  const { pageCrawler } = require('./pageCrawler')
  const { batchImageCollection } = require('./batchImageCollection');
  const { pageMergeFiles } = require('./page_merge_files')
  const { pageExportExcel } = require('./page_export_excel')
  const { pageUploadExcel } = require('./page_upload_excel')
  const { batchImageProcessing } = require('./batchImageProcessing');
  const { pageNavDataTreeCreation } = require('./pageNavTreeCreation')
  const { pageLeavesBy100 } = require('./pageLeavesBy100')
  const { pageUploadImage } = require('./page_upload_image')
  const { pagePrerender } = require('./pagePrerender')
  const { fbDatabase, firebaseApp } = require('../utils/firebase/firebaseInit')

  const tasks = projects[process.env.projectName]
  const taskSequelizerEventEmitter = taskSequelizer({ tasks })
  firebaseEvetEmitter({ taskSequelizerEventEmitter })
  taskSequelizerEventEmitter.on('nextTask', async function (nextTaskName) {
    debugger;
    switch (nextTaskName) {
      case 'page_collection':
        removeDerectory('page-data') && removeDerectory('page-collection-errors') && pageCrawler({ taskSequelizerEventEmitter })
        break;
      case 'page_merge_files':
        removeDerectory('page-merged-files') && pageMergeFiles({ taskSequelizerEventEmitter })
        break;
      case 'page_export_excel':
        removeDerectory('page-data-excel') && pageExportExcel({ taskSequelizerEventEmitter })
        break;
      case 'page_upload_excel':
        pageUploadExcel({ taskSequelizerEventEmitter })
        break;
      case 'page_image_collection':
        batchImageCollection({ taskSequelizerEventEmitter })
        break;
      case 'page_upload_image':
        debugger;
        pageUploadImage({ taskSequelizerEventEmitter })
        break;
      case 'test_image_collection':
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
      case 'test_image_crop':
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
      case 'test_image_blur':
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
      case 'test_image_embed':
        break;
      case 'page_nav_data_tree_creation':
        removeDerectory('page-tree') &&
          pageNavDataTreeCreation({ taskSequelizerEventEmitter })
        break;
      case 'page_leaves_creation':
        removeDerectory('page-leave') &&
          pageLeavesBy100({ taskSequelizerEventEmitter })
        break;
      case 'page_generation':
        removeDerectory('page-list-pages') &&
          pageGeneration({ taskSequelizerEventEmitter })
        break;
      case 'page_nav_items':
        pageNavigationItems({ taskSequelizerEventEmitter })
        break;
      case 'page_builder':
        removeDerectory('page-build') &&
          pageBuilder({ taskSequelizerEventEmitter });
        break;
      case 'page_prerender':
        removeDerectory('page-prerendered') &&
          pagePrerender({ taskSequelizerEventEmitter });
        break;
      default:
      //break;
    }
  })
  console.log('nextTask started', process.env.NEXT_TASK)
  taskSequelizerEventEmitter.emit('nextTask', process.env.NEXT_TASK)
}



if (process.env.SERVER === 'LOCAL_SERVER') {

  const http = require('http');
  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    let data = [];

    switch (req.method) {
      case "OPTIONS":
        res.statusCode = 200
        res.end();
        break;
      case "POST":

        req.on("data", (chunk) => {
          data.push(chunk);
        });
        req.on("end", async () => {

          if (data.length > 0) {

            const body = JSON.parse(data);
            const { inputs: { projectName, parameters } } = body

            const { fbDatabase, firebaseApp } = require('../utils/firebase/firebaseInit')
            const { startedDateTime, fb_custom_tkn } = parameters
            debugger;
            const auth = firebaseApp.auth()
            auth.signInWithCustomToken(fb_custom_tkn).then(credential => {
              const {user:{uid}} =credential
              debugger;
           
              global.fb_run_id = startedDateTime
              global.fb_custom_tkn = fb_custom_tkn
              global.fb_uid=uid
              process.env.projectName = projectName
              debugger;
              change()
            }).catch(error => {
              debugger;
            })




          }

        });

        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain');
        res.end('local workflow triggered')
        break;
      default:
        res.setHeader('Content-Type', 'text/plain');
        res.end('Unhandled method')
    }


  })
  server.listen(3001, () => {
    console.log(`LOCAL workflow server running on port ${3001}`);
  });

} else if (process.env.SERVER === 'LOCAL') {
  process.env.projectName = 'books'
  change()

} else if (process.env.SERVER === 'GITHUB_ACTION') {
  //change()
}
