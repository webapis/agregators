

  require('dotenv').config()
function change() {


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


  const tasks = projects[process.env.projectName]
  const taskSequelizerEventEmitter = taskSequelizer({ tasks })
  firebaseEvetEmitter({ taskSequelizerEventEmitter })
  taskSequelizerEventEmitter.on('nextTask', async function (nextTaskName) {

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
  const { renewIdToken } = require('../utils/firebase/firebase-rest')
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
            debugger;
            const { startedDateTime, fb_refresh_token, uid, api_key, fb_database_url, email } = JSON.parse(parameters)
            debugger;
            const renewedData = await renewIdToken({ api_key, refresh_token: fb_refresh_token })

            global.fb_database_url = fb_database_url
            global.fb_run_id = startedDateTime
            global.fb_uid = uid
            global.fb_id_token = renewedData.id_token
            process.env.projectName = projectName
            process.env.email = email
            change()
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

  (async () => {
    require('dotenv').config()
    const { renewIdToken } = require('../utils/firebase/firebase-rest')
    const renewedData = await renewIdToken({ api_key: process.env.api_key, refresh_token: process.env.fb_refresh_token })
    debugger;
    global.fb_database_url = process.env.fb_database_url
    global.fb_run_id = Date.now()
    global.fb_uid = process.env.uid
    global.fb_id_token = renewedData.id_token
    process.env.projectName = 'books'
    process.env.email = "tkm.house.new@gmail.com"
    change()
  })()


} else { 
  (async()=>{

    debugger;
    const { startedDateTime, fb_refresh_token, uid, api_key, fb_database_url, email } = JSON.parse(process.env.parameters)
    debugger;
    const renewedData = await renewIdToken({ api_key, refresh_token: fb_refresh_token })
    global.fb_database_url = fb_database_url
    global.fb_run_id = startedDateTime
    global.fb_uid = uid
    global.fb_id_token = renewedData.id_token
    process.env.projectName = process.env.projectName
    process.env.email = email
    await change()

  })()

}
