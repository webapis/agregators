const { printTable } = require('console-table-printer');
const { fbDatabase } = require('../firebaseInit')
const rows = []
function stateTableLog({ self, promise }) {
  try {


    const { batchName } = promise

    const total = self.total.filter(t => t.batchName === batchName).length;
    const inQueue = self.queue.filter(t => t.batchName === batchName).length;
    const inProccess = self.promises.filter(t => t.batchName === batchName && t.retries === 0).length;
    const retries = self.promises.filter(t => t.batchName === batchName && t.retries > 0).length;
    const resolved = self.resolved.filter(t => t.batchName === batchName).length;
    const rejected = self.rejected.filter(t => t.batchName === batchName).length
    const findIndex = rows.findIndex(f => f.batchName === batchName)



    if (findIndex !== -1) {
      rows.splice(findIndex, 1)

    }
    const log =
      { batchName, total, inQueue, inProccess, retries, resolved, rejected }

    // const dbRef = fbDatabase.ref(`projects/${process.env.projectName}/${self.taskName}/${batchName}`)

    // dbRef.set({ total, inQueue, inProccess, retries, resolved, rejected }, (error) => {
    //   if (error) {
    //     debugger;
    //     console.log('fbDatabase error', error)
    //   } else {
    //     console.log('firebase updated')
    //   }
    // })

    rows.push(log)
    printTable(rows)
    if (retries.length > 0) {
      debugger;
    }

    setTimeout(() => {
      self.emit('invokeNextPromise')
    }, 0)
  } catch (error) {
    console.log(error)
    process.exit(1)
    debugger;
  }
}



module.exports = {
  stateTableLog
}