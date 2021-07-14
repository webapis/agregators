require('dotenv').config()


 
const { projects } = require('./project.config');
const { removeDerectory } = require('./removeDerectory');
const { taskSequelizer } = require('./task-sequelizer')
const { pageGeneration } = require('./pageGenerator');
const { pageScriptAttacher } = require('./pageScriptAttacher');
const { pageComponentAttacher } = require('./pageComponentAttacher');
const { pageBuilder } = require('./pageBuilder');
const { pageNavigationItems } = require('./pageNavigationItems');
const { batchPageCollector } = require('./batchPageCollector');
const { batchImageCollection } = require('./batchImageCollection');
const { batchImageProcessing } = require('./batchImageProcessing');
const { pageNavDataTreeCreation } = require('./pageNavTreeCreation')
const { pageLeavesBy100 } = require('./pageLeavesBy100')
const {pageUploadData}=require('./pageUploadData')
const {pagePrerender}=require('./pagePrerender')
function change() {
  const tasks = projects[process.env.projectName]
  const taskSequelizerEventEmitter = taskSequelizer({ tasks })
  taskSequelizerEventEmitter.on('nextTask', async function (nextTaskName) {
    switch (nextTaskName) {
      case 'page_collection':
       await batchPageCollector({ taskSequelizerEventEmitter})
        break;
      case 'page_data_upload':
       pageUploadData({taskSequelizerEventEmitter,fbStorage:true})
        break;
      case 'page_image_collection':
         batchImageCollection({ taskSequelizerEventEmitter })
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
        pageLeavesBy100({ taskSequelizerEventEmitter })
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

change()


