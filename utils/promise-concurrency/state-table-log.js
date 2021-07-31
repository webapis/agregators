const { printTable } = require('console-table-printer');
const { fb_steps } = require('../firebase/firebaseEventEmitter')
const rows = []
function stateTableLog({ self, promise }) {

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

  rows.push(log)
  printTable(rows)


}

// function calculatePromiseState({ self}) {

//   const batchNames = self.total.map((m) => m.batchName)
//   let promiseStates = []
//   batchNames.forEach(batchName => {
//     const total = self.total.filter(t => t.batchName === batchName).length;
//     const inQueue = self.queue.filter(t => t.batchName === batchName).length;
//     const inProccess = self.promises.filter(t => t.batchName === batchName && t.retries === 0).length;
//     const retries = self.promises.filter(t => t.batchName === batchName && t.retries > 0).length;
//     const resolved = self.resolved.filter(t => t.batchName === batchName).length;
//     const rejected = self.rejected.filter(t => t.batchName === batchName).length
//     promiseStates.push({ total, inQueue, inProccess, retries, resolved, rejected, batchName })
//   })
//   const promiseState = convertArrayToObject(promiseStates, 'batchName')
//   global.fb_eventEmitter.emit(fb_steps.PC_PROMISE_STATE_CHANGED,  promiseState)

// }
// const convertArrayToObject = (array, key) => {
//   const initialValue = {};
//   return array.reduce((obj, item) => {
//     return {
//       ...obj,
//       [item[key]]: item,
//     };
//   }, initialValue);
// }
module.exports = {
  stateTableLog,
 // calculatePromiseState
}