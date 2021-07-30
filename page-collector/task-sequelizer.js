const EventEmitter = require('events');
const { fb_steps } = require('../utils/firebase/firebaseEventEmitter');
const { fbDatabase } = require('../utils/firebase/firebaseInit')
const { countData } = require('../utils/firebase/firebaseEventEmitter')

const startedDateTime = Date.now()
global.fb_run_id = startedDateTime
class TaskListender extends EventEmitter {
    constructor({ tasks }) {
        super()

        this.on('taskComplete', (taskName) => {
            taskComplete(taskName)
            const activeTasks = tasks.filter(t => Object.values(t)[0] === true)
            const completeTaskIndex = activeTasks.findIndex((element) => element.hasOwnProperty(taskName))
            const isLastTask = activeTasks[activeTasks.length - 1].hasOwnProperty(taskName)
            const taskRef = fbDatabase.ref(`projects/${process.env.projectName}`)
            if (process.env.ALL === 'TRUE' && activeTasks.length > 1 && isLastTask === false) {
                //    taskRef.update({ [taskName]: true }, () => {
                console.log('task complete', taskName)
                if (completeTaskIndex + 1 < tasks.length) {
                    const nextTask = activeTasks.find((o, i) => i === completeTaskIndex + 1)
                    const nextTaskName = Object.keys(nextTask)[0]
                    this.emit('nextTask', nextTaskName)
                    console.log('nextTask', nextTaskName)
                } else {
                    this.emit('no_more_task')

                }
                //});

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
    let dbRef =null;
    switch (taskName) {
        case 'page_collection':
            dbRef=  fbDatabase.ref(`projects/${process.env.projectName}/${startedDateTime}/${fb_steps.CRAWLING_STARTED}`)
            dbRef.set(startedDateTime, (error) => {
                if (error) {
                    console.log(error)
                } else {
                    
                }
            })
            break;
        case 'page_merge_files':
             dbRef = fbDatabase.ref(`projects/${process.env.projectName}/${startedDateTime}/${fb_steps.MERGING_FILES_STARTED}`)
            dbRef.set(Date.now(), (error) => {
                if (error) {
                    console.log(error)
                } else {
                    
                }
            })
            break;

        default:
        // { page_data_collection: true },
        // { page_data_export: false }
        // { page_data_upload: false },
        // { page_image_collection: false },
        // { page_image_upload: false },
        // { page_image_crop: false },
        //  { page_image_blur: false },
        // { page_image_embed: false },
        // { page_nav_data_tree_creation: false },
        // { page_leaves_creation: false },
        // { page_generation: false },

        // { page_nav_items: false },
        //  { page_builder: false },
        // { page_prerender: false }
    }
}

function taskComplete(taskName) {
    let dbRef =null;
    switch (taskName) {
        case 'page_collection':
             dbRef = fbDatabase.ref(`projects/${process.env.projectName}/${startedDateTime}/${fb_steps.CRAWLING_COMPLETE}`)
            dbRef.set(Date.now(), (error) => {
                if (error) {
                    console.log(error)
                } else {
                    
                }
            })
            break;

        case 'page_merge_files':
             dbRef = fbDatabase.ref(`projects/${process.env.projectName}/${startedDateTime}/${fb_steps.MERGING_FILES_COMPLETE}`)
            dbRef.set(Date.now(), (error) => {
                if (error) {
                    console.log(error)
                } else {
                    
                }
            })
            break;
        default:
        // { page_data_collection: true },
        // { page_data_export: false }
        // { page_data_upload: false },
        // { page_image_collection: false },
        // { page_image_upload: false },
        // { page_image_crop: false },
        //  { page_image_blur: false },
        // { page_image_embed: false },
        // { page_nav_data_tree_creation: false },
        // { page_leaves_creation: false },
        // { page_generation: false },

        // { page_nav_items: false },
        //  { page_builder: false },
        // { page_prerender: false }
    }
}

function taskFailed(taskName) {
    let dbRef =null;
    switch (taskName) {
        case 'page_collection':
             dbRef = fbDatabase.ref(`projects/${process.env.projectName}/${startedDateTime}/${fb_steps.CRAWLING_FAILED}`)
            dbRef.set(Date.now(), (error) => {
                if (error) {
                    console.log(error)
                } else {
                    process.exit(1)
                }
            })
            break;
        case 'page_merge_files':
             dbRef = fbDatabase.ref(`projects/${process.env.projectName}/${startedDateTime}/${fb_steps.MERGING_FILES_FAILED}`)
            dbRef.set(Date.now(), (error) => {
                if (error) {
                    console.log(error)
                } else {
                    
                }
            })
            break;
        default:
        // { page_data_collection: true },
        // { page_data_export: false }
        // { page_data_upload: false },
        // { page_image_collection: false },
        // { page_image_upload: false },
        // { page_image_crop: false },
        //  { page_image_blur: false },
        // { page_image_embed: false },
        // { page_nav_data_tree_creation: false },
        // { page_leaves_creation: false },
        // { page_generation: false },

        // { page_nav_items: false },
        //  { page_builder: false },
        // { page_prerender: false }
    }
}

module.exports = { taskSequelizer }


/*
    taskSequelizerEventEmitter.on('taskComplete', (taskName) => {
        
        let fbStep = ''
        switch (taskName) {
            case 'page_collection':
                fbStep = fb_steps.CRAWLING_COMPLETE
                break;
            default:
                fbStep = 'none'
        }
        const dbRef = fbDatabase.ref(`projects/${projectName}/${startedDateTime}/${fbStep}`)
        dbRef.set(Date.now(), (error) => {
            if (error) {
                console.log(error)
            } else {
                
            }
        })
    })

    taskSequelizerEventEmitter.on('nextTask', (taskName) => {
        let fbStep = ''
        switch (taskName) {
            case 'page_collection':
                fbStep = fb_steps.CRAWLING_STARTED
                break;
            default:
                fbStep = 'none'
        }

        const dbRef = fbDatabase.ref(`projects/${projectName}/${startedDateTime}/${fbStep}`)
        dbRef.set(startedDateTime, (error) => {
            if (error) {
                console.log(error)
            } else {
                
            }
        })

    })

    taskSequelizerEventEmitter.on('taskError', (error) => {

    })
    taskSequelizerEventEmitter.on('no_more_task', () => {
        
        firebaseEmitter.emit(fb_steps.NO_MORE_TASK)
    })
*/