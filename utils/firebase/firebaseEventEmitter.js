const EventEmitter = require('events');
const { fbDatabase } = require('./firebaseInit')
const { walkSync } = require('../../page-collector/walkSync');
const path = require('path')
const fs = require('fs')
const fb_steps = {
    CRAWLING_STARTED: 'CRAWLING_STARTED',
    CRAWLING_COMPLETE: 'CRAWLING_COMPLETE',
    CRAWLING_FAILED: 'CRAWLING_FAILED',
    CRAWLING_CANCELLED: 'CRAWLING_CANCELLED',
    DATA_COLLECTED: 'DATA_COLLECTED',
    DATA_COLLECTION_FAILED: 'DATA_COLLECTION_FAILED',
    NO_MORE_TASK: 'NO_MORE_TASK',
    MERGING_FILES_STARTED: 'MERGING_FILES_STARTED',
    MERGING_FILES_COMPLETE: 'MERGING_FILES_COMPLETE',
    MERGING_FILES_FAILED: 'MERGING_FILES_FAILED',
    RETRIE_PROMISE_FAILED: 'RETRIE_PROMISE_FAILED',

    PC_PROMISE_STATE_CHANGED: 'PC_PROMISE_STATE_CHANGED'//promiseConcurrency state change
}
const projectName = process.env.projectName


class FirebaseEmitter extends EventEmitter {
    constructor() {
        super()
        // this.on(fb_steps.PC_PROMISE_STATE_CHANGED, (state) => {
        //     debugger;
        //     const dbRef = fbDatabase.ref(`projects/${projectName}/${global.fb_run_id}/${fb_steps.PC_PROMISE_STATE_CHANGED}`)
        //     dbRef.set(state, (error) => {
        //         if (error) {
        //             console.log(error)
        //         } else {
        //             debugger;
        //         }
        //     })


        // })
        this.on(fb_steps.DATA_COLLECTION_FAILED, () => {
            const dbRef = fbDatabase.ref(`projects/${projectName}/${global.fb_run_id}/DATA_COLLECTION_FAILED`)
            dbRef.once('value', (snapshot) => {
                let data = snapshot.val() === null ? 0 : snapshot.val()

                dbRef.set(++data, (error) => {
                    if (error) {
                        console.log(error)
                    } else {

                    }
                })

            })
        })

        this.on(fb_steps.RETRIE_PROMISE_FAILED, ({ batchName, taskName }) => {
            const dbRef = fbDatabase.ref(`projects/${projectName}/${global.fb_run_id}/${taskName}/${batchName}`)
            dbRef.once('value', (snapshot) => {
                let data = snapshot.val() === null ? 0 : snapshot.val()

                dbRef.set(++data, (error) => {
                    if (error) {
                        console.log(error)
                    } else {

                    }
                })

            })
        })
    }
}


function firebaseEvetEmitter() {
    global.fb_dataCounter = setInterval(() => {
        if (fs.existsSync(`${process.cwd()}/page-data/${process.env.projectName}`)) {
            countData()
        }
    }, 10000)
    const firebaseEmitter = new FirebaseEmitter();
    firebaseEmitter.setMaxListeners(50);
    global.fb_eventEmitter = firebaseEmitter
}

function countData(cb) {

    if (fs.existsSync(`${process.cwd()}/page-data/${process.env.projectName}`)) {
        let files = []
        let counter = {}

        walkSync(`${process.cwd()}/page-data/${process.env.projectName}`, async filepath => {
            files.push(filepath)
        });
        if (files.length > 0) {
            for (let filepath of files) {
                const data = fs.readFileSync(filepath, { encoding: 'utf-8' });
                const batchName = path.basename(filepath, '.json')

                if (data) {
                    const dataObject = JSON.parse(data)
                    counter = { ...counter, [batchName]: counter[batchName] > 0 ? counter[batchName] + dataObject.length : dataObject.length }
                
                }
            }
            if (counter) {
                const dbRef = fbDatabase.ref(`projects/${projectName}/${global.fb_run_id}/DATA_COLLECTED`)
                dbRef.set(counter, (error) => {
                    if (error) {
                        console.log(error)
                    } else {
                        if (cb) {
                            cb()
                        }
                    }
                })
            } else {
                if (cb) {
                    cb()
                }
            }
        } else {
            if (cb) {
                cb()
            }
        }
    } else {
        if (cb) {
            cb()
        }
    }
}
// function convertArrayToObject(array, key) {
//     const initialValue = {};
//     return array.reduce((obj, item) => {
//         return {
//             ...obj,
//             [item[key]]: item,
//         };
//     }, initialValue);
// }

module.exports = {
    fb_steps,
    countData,
    firebaseEvetEmitter

}


