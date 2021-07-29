const EventEmitter = require('events');
const { fbDatabase } = require('./firebaseInit')
const { walkSync } = require('../../page-collector/walkSync');
const fs = require('fs')
const fb_steps = {
    CRAWLING_STARTED: 'CRAWLING_STARTED',
    CRAWLING_COMPLETE: 'CRAWLING_COMPLETE',
    CRAWLING_FAILED: 'CRAWLING_FAILED',
    CRAWLING_CANCELLED: 'CRAWLING_CANCELLED',
    DATA_COLLECTED: 'DATA_COLLECTED',
    DATA_COLLECTION_FAILED: 'DATA_COLLECTION_FAILED',
    NO_MORE_TASK: 'NO_MORE_TASK',
    MERGING_FILES_STARTED:'MERGING_FILES_STARTED',
    MERGING_FILES_COMPLETE:'MERGING_FILES_COMPLETE',
    MERGING_FILES_FAILED:'MERGING_FILES_FAILED',
}
const projectName = process.env.projectName


class FirebaseEmitter extends EventEmitter {
    constructor() {
        super()

        this.on(fb_steps.DATA_COLLECTION_FAILED, () => {
            const dbRef = fbDatabase.ref(`projects/${projectName}/${global.fb_run_id}/DATA_COLLECTION_FAILED`)
            dbRef.once('value', (snapshot) => {
                let data = snapshot.val() === null ? 0 : snapshot.val()
                debugger;
                dbRef.set(++data, (error) => {
                    if (error) {
                        console.log(error)
                    } else {
                        debugger;
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
    let files = []
    let counter = 0
    walkSync(`${process.cwd()}/page-data/${process.env.projectName}`, async filepath => {
        files.push(filepath)
    });
    if (files.length > 0) {
        for (let filepath of files) {
            const data = fs.readFileSync(filepath, { encoding: 'utf-8' });
            if (data) {
                const dataObject = JSON.parse(data)
                counter = counter + dataObject.length
            }
        }
        if (counter > 0) {
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
        }
    }

}

module.exports = {
    fb_steps,
    countData,
    firebaseEvetEmitter

}


