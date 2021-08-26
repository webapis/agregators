const EventEmitter = require('events');
const { fb_steps } = require('../utils/firebase/firebaseEventEmitter');
const { fbDatabase } = require('../utils/firebase/firebaseInit')
const { countData } = require('../utils/firebase/firebaseEventEmitter')

const startedDateTime = global.fb_run_id
const rootFirebaseRef = `runs/${global.fb_uid}/${process.env.projectName}/${startedDateTime}`
class TaskListender extends EventEmitter {
    constructor({ tasks }) {
        super()

        this.on('taskComplete', (taskName, payload) => {
            taskComplete(taskName, payload)
            const activeTasks = tasks.filter(t => Object.values(t)[0] === true)
            const completeTaskIndex = activeTasks.findIndex((element) => element.hasOwnProperty(taskName))
            const isLastTask = activeTasks[activeTasks.length - 1].hasOwnProperty(taskName)

            if (process.env.ALL === 'TRUE' && activeTasks.length > 1 && isLastTask === false) {

                console.log('task complete', taskName)
                if (completeTaskIndex + 1 < tasks.length) {
                    const nextTask = activeTasks.find((o, i) => i === completeTaskIndex + 1)
                    const nextTaskName = Object.keys(nextTask)[0]
                    this.emit('nextTask', nextTaskName)
                    console.log('nextTask', nextTaskName)
                } else {
                    this.emit('no_more_task')
                }

            } else {
                console.log('single task complete:', taskName)
                this.emit('no_more_task')
            }
        })

        this.on('nextTask', (taskName) => {
            taskStarted(taskName)
        })
        this.on('taskFailed', (taskName) => {
            taskFailed(taskName)
        })
        this.on('no_more_task', () => {
            clearInterval(global.fb_dataCounter)
            countData(() => {
                process.exit(0)
            })
        })
    }
}
function taskSequelizer({ tasks }) {
    const promiseEmitter = new TaskListender({ tasks });
    promiseEmitter.setMaxListeners(50);
    return promiseEmitter;
}

function taskStarted(taskName) {
    let dbRef = null;
    switch (taskName) {
        case 'page_collection':
            dbRef = fbDatabase.ref(`${rootFirebaseRef}/${fb_steps.CRAWLING_STARTED}`)
            dbRef.set(Date.now(), (error) => {
                if (error) {
                    console.log(error)
                } else {

                }
            })
            break;
        case 'page_merge_files':
            dbRef = fbDatabase.ref(`${rootFirebaseRef}/${fb_steps.MERGING_FILES_STARTED}`)
            dbRef.set(Date.now(), (error) => {
                if (error) {
                    console.log(error)
                } else {

                }
            })
            break;
        case 'page_export_excel':
            dbRef = fbDatabase.ref(`${rootFirebaseRef}/${fb_steps.PAGE_EXPORT_EXCEL_STARTED}`)
            dbRef.set(Date.now(), (error) => {
                if (error) {
                    console.log(error)
                } else {

                }
            })
            break;
        case 'page_upload_excel':
            dbRef = fbDatabase.ref(`${rootFirebaseRef}/${fb_steps.PAGE_UPLOAD_EXCEL}`)
            dbRef.set({ start: Date.now() }, (error) => {
                if (error) {
                    console.log(error)
                } else {

                }
            })
            break;
        case 'page_image_collection':
            dbRef = fbDatabase.ref(`${rootFirebaseRef}/COLLECTING_IMAGES`)
            dbRef.update({ start: Date.now() }, (error) => {
                if (error) {
                    console.log(error)
                } else {

                }
            })
            break;
        case 'page_upload_image':
            dbRef = fbDatabase.ref(`${rootFirebaseRef}/UPLOADING_IMAGES`)
            dbRef.update({ start: Date.now() }, (error) => {
                if (error) {
                    console.log(error)
                } else {

                }
            })
            break;
        default:

    }
}

//page_upload_image
function taskComplete(taskName, payload) {
    let dbRef = null;
    switch (taskName) {
        case 'page_collection':
            dbRef = fbDatabase.ref(`${rootFirebaseRef}/${fb_steps.CRAWLING_COMPLETE}`)
            dbRef.set(Date.now(), (error) => {
                if (error) {
                    console.log(error)
                } else {
                }
            })
            break;

        case 'page_merge_files':
            dbRef = fbDatabase.ref(`${rootFirebaseRef}/${fb_steps.MERGING_FILES_COMPLETE}`)
            dbRef.set(Date.now(), (error) => {
                if (error) {
                    console.log(error)
                } else {

                }
            })
            break;
        case 'page_export_excel':
            dbRef = fbDatabase.ref(`${rootFirebaseRef}/${fb_steps.PAGE_EXPORT_EXCEL_COMPLETE}`)
            dbRef.set(Date.now(), (error) => {
                if (error) {
                    console.log(error)
                } else {
                }
            })
            break;

        case 'page_upload_excel':
            const { webViewLink, webContentLink } = payload
            dbRef = fbDatabase.ref(`${rootFirebaseRef}/${fb_steps.PAGE_UPLOAD_EXCEL}`)
            dbRef.update({ end: Date.now(), webViewLink, webContentLink }, (error) => {
                if (error) {
                    console.log(error)
                } else {
                }
            })
            break;
        case 'page_image_collection':
            dbRef = fbDatabase.ref(`${rootFirebaseRef}/COLLECTING_IMAGES`)
            dbRef.update({ end: Date.now() }, (error) => {
                if (error) {
                    console.log(error)
                } else {

                }
            })
            break;
        case 'page_upload_image':

            dbRef = fbDatabase.ref(`${rootFirebaseRef}/UPLOADING_IMAGES`)
            dbRef.update({ end: Date.now(), webViewLink: payload.webViewLink }, (error) => {
                if (error) {
                    console.log(error)
                } else {

                }
            })
            break;
        default:

    }
}

function taskFailed(taskName) {
    let dbRef = null;
    switch (taskName) {
        case 'page_collection':
            dbRef = fbDatabase.ref(`${rootFirebaseRef}/${fb_steps.CRAWLING_FAILED}`)
            dbRef.set(Date.now(), (error) => {
                if (error) {
                    console.log(error)
                } else {
                    process.exit(1)
                }
            })
            break;
        case 'page_merge_files':
            dbRef = fbDatabase.ref(`${rootFirebaseRef}/${fb_steps.MERGING_FILES_FAILED}`)
            dbRef.set(Date.now(), (error) => {
                if (error) {
                    console.log(error)
                } else {

                }
            })
            break;
        case 'page_merge_files':
            dbRef = fbDatabase.ref(`${rootFirebaseRef}/${fb_steps.MERGING_FILES_FAILED}`)
            dbRef.set(Date.now(), (error) => {
                if (error) {
                    console.log(error)
                } else {

                }
            })
            break;
        case 'page_export_excel':
            dbRef = fbDatabase.ref(`${rootFirebaseRef}/${fb_steps.PAGE_EXPORT_EXCEL_FAILED}`)
            dbRef.set(Date.now(), (error) => {
                if (error) {
                    console.log(error)
                } else {

                }
            })
            break;
        case 'page_upload_excel':

            dbRef = fbDatabase.ref(`${rootFirebaseRef}/${fb_steps.PAGE_UPLOAD_EXCEL}`)
            dbRef.update({ end: Date.now(), error: true }, (error) => {
                if (error) {
                    console.log(error)
                } else {

                }
            })
            break;
        case 'page_image_collection':
            dbRef = fbDatabase.ref(`${rootFirebaseRef}/COLLECTING_IMAGES`)
            dbRef.update({ failed: true }, (error) => {
                if (error) {
                    console.log(error)
                } else {

                }
            })
            break;
        case 'page_upload_image':
            dbRef = fbDatabase.ref(`${rootFirebaseRef}/UPLOADING_IMAGES`)
            dbRef.update({ failed: true }, (error) => {
                if (error) {
                    console.log(error)
                } else {

                }
            })
            break;
        default:

    }
}

module.exports = { taskSequelizer }


