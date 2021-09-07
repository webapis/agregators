require('dotenv').config()

const {
    isMainThread, workerData
} = require('worker_threads');


    if (workerData) {
        const { fb_run_id, fb_uid, fb_id_token, projectName, email, fb_database_url } = workerData
        global.fb_run_id = fb_run_id
        global.fb_uid = fb_uid
        global.fb_id_token = fb_id_token
        process.env.projectName = projectName
        process.env.email = email
        global.fb_database_url = fb_database_url
        console.log('hello outside')
        crawler()
     
    }



function crawler() {




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
    const { fbRest } = require('../utils/firebase/firebase-rest')

    const fbDatabase = fbRest().setIdToken(global.fb_id_token).setProjectUri(global.fb_database_url)

    const startedDateTime = global.fb_run_id
   // const rootFirebaseRef = `runs/${global.fb_uid}/${process.env.projectName}/${startedDateTime}`

   // fbDatabase.ref(`${rootFirebaseRef}/RUN_STARTED`).set(parseInt(startedDateTime), (error) => {
       // if (error) {
       //     console.log('error', error)
       /// } else {

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
    //    }
 //   })
}


module.exports = { crawler }