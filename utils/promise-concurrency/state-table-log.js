const { printTable } = require('console-table-printer');
const rows = []
function stateTableLog({ self, promise }) {
  debugger;
  const { batchName } = promise
  debugger;
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


  rows.push(log)
  printTable(rows)
  setTimeout(() => {
    self.emit('invokeNextPromise')
  }, 0)

}



module.exports = {
  stateTableLog
}