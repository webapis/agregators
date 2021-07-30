

const {  isMainThread, Worker } = require('worker_threads');
//const {fbDatabase}=require('./firebaseInit')
const { printTable } = require('console-table-printer');
const { uuidv4 } = require('./uuidv4');
const EventEmitter = require('events');


class PromiseEmitter extends EventEmitter {
    constructor(batch, totalConcur) {
      super();
      this.batch = batch;
      this.totalConcur = totalConcur;
      this.queue = [];
      this.tasks = [];
      this.rejected = [];
      this.resolved = [];
      this.total = 0,
      this.proccess=[]
  
      this.on('taskAttached', function (task) {
      this.processType=task.processType
     const taskWithId = task
      taskWithId.id = uuidv4()
      this.queue.push(taskWithId)
      this.total = [];
        
    
      });

      this.on('all_tasks_attached',(total)=> {
        this.total=total
       this.runTask()
  
      })

      this.on('batch_complete',(batch)=>{
        const {id,nextSlice}=batch;
        this.proccess.shift()
        this.resolved.push(...nextSlice)
        const projectName =process.env.projectName
        const inQueue= this.queue.length>0? this.queue.length * this.batch:0
        const inProcess= this.proccess.length*this.batch
        const processType= this.processType
        const total =this.total
        const resolved =this.resolved.length
        const log = [{ projectName, processType,total,inQueue,resolved, inProcess}];
        _updateFirebase({processType,total,inQueue,inProcess,resolved})
        
        printTable(log);
        if(this.queue.length===0 && this.proccess.length===0){
          console.log('all task complete')
          this.emit('all_tasks_complete')
   
        }
        if(this.proccess.length < this.totalConcur){
          this.runTask()
        } else{
     
        }
      
    
      })
      

    }
    runTask() {
      if(this.queue.length>0){
        const projectName =process.env.projectName
        for(let i=0; i<= this.totalConcur;i++){
          if(this.queue.length>0 && this.proccess.length<=this.totalConcur){
          
          const {workerData,script,id,eventEmitter} =this.queue[0]
   
          workerService({workerData,script,id,eventEmitter})
          this.proccess.push(this.queue[i])
          
         this.queue.shift()
         const inQueue= this.queue.length>0? this.queue.length * this.batch:0
         const inProcess= this.proccess.length*this.batch
         const processType= this.processType
         const total =this.total
         const resolved =this.resolved.length
         const log = [{ projectName, processType,total,inQueue,resolved, inProcess}];
      //   _updateFirebase({processType,total,inQueue,inProcess,resolved})
        printTable(log);
          
        } else{

          break;
        }
      }
      }
    }
    taskStateChanged() {
      this.emit('taskStateChanged', {
        queue: this.queue,
        tasks: this.tasks,
        rejected: this.rejected,
        total: this.total,
        resolved: this.resolved
      });
    }
  }


  function cpuTaskController({ batch, totalConcurrency }) {
    const promiseEmitter = new PromiseEmitter(batch, totalConcurrency);
    promiseEmitter.setMaxListeners(50);
    return promiseEmitter;
  }


  


let worker = {};

  function workerService({ workerData, script,eventEmitter,id }) {
   
       return  new Promise((resolve, reject) => {
              
                if (isMainThread) {
                  worker = new Worker(script, { workerData });
                  worker.on('message', resolve);
                  worker.on('error', reject);
                  worker.on('exit', code=>{
                      
                  })
                }
              }).then(()=>{
               const {nextSlice}=workerData
                eventEmitter.emit('batch_complete',{id,nextSlice})
                
              }).catch(error=>{
                console.log('worker rejected',error)
                
              })
        
  }


  // function _updateFirebase({processType,total,inQueue,inProcess,resolved}){
  //   const dbRef =fbDatabase.ref(`projects/${process.env.projectName}/imageProcessing/${processType}`)

  //   dbRef.set({total, inQueue, resolved,inProcess},(error)=>{
  //     if(error){
  //       
  //       console.log('fbDatabase error',error)
  //     } else{
  //       console.log('firebase updated')
  //     }
  //   })
  // }

module.exports = { cpuTaskController };

