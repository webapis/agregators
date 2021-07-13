
const {promiseConcurrency}=require('../index')
const assert =require('assert')
describe('testing state-table-log', function(){
    it.skip('test promise attached event', function(done){
        try {
            this.timeout(200000)
            debugger;
        
          const eventEmitter=  promiseConcurrency({batchConcurrency:2,rejectedRetry:3})
          eventEmitter.once('log_complete',()=>{
                assert.equal(eventEmitter.total.length,1,"total")
                assert.equal(eventEmitter.queue.length,0, "queue")
                assert.equal(eventEmitter.promises.length,1,"inProcess")
                assert.equal(eventEmitter.retries.length,0,"retries")
                assert.equal(eventEmitter.resolved.length,0,"resolved")
                assert.equal(eventEmitter.rejected.length,0,"rejected")
                done()
            debugger;
        })
        const defactoPromise =()=>{}
            defactoPromise.batchName='defacto'

          eventEmitter.emit('promiseAttached',{promise:defactoPromise,unshift:false})

        } catch (error) {
            debugger;
            throw error
            //done()
        }
 
    })
    it('test promise resolved event', function(done){
        try {
            this.timeout(200000)
            debugger;
        
          const eventEmitter=  promiseConcurrency({batchConcurrency:2,rejectedRetry:3})
       
       
          eventEmitter.once('log_complete',()=>{
       
                 assert.equal(eventEmitter.total.length,2,"total")
                 assert.equal(eventEmitter.queue.length,0, "queue")
                 assert.equal(eventEmitter.promises.length,1,"inProcess")
                 assert.equal(eventEmitter.retries.length,0,"retries")
                 assert.equal(eventEmitter.resolved.length,1,"resolved")
                 assert.equal(eventEmitter.rejected.length,0,"rejected")
                 debugger;
             done()
         
        })
        eventEmitter.on('initStateSet',()=>{
            eventEmitter.emit('promiseResolved',{id:'123',batchName:'defacto'})
        })
        const defactoPromise =()=>{
                return ({batchName,id})=>{
                   
                 
                    debugger
                }
        }
            defactoPromise.batchName='defacto'
            defactoPromise.id='123'
            
        const kotonPromise =()=>{
            return ({batchName,id})=>{
                debugger
            }
        }
        kotonPromise.batchName='koton'
        kotonPromise.id='456'
            eventEmitter.emit('initState',{total:[defactoPromise,kotonPromise],promises:[defactoPromise,kotonPromise]})
           // 
         
        } catch (error) {
            debugger;
            throw error
            //done()
        }
 
    })

    it('put rejected promise into queue', function(done){
        try {
            this.timeout(200000)
            debugger;
            const defactoPromise =()=>{
                return ({batchName,id})=>{
                   
                 
                    debugger
                }
        }
            defactoPromise.batchName='defacto'
            defactoPromise.id='123'
            defactoPromise.retries=0
            
        const kotonPromise =()=>{
            return ({batchName,id})=>{
                debugger
            }
        }
        kotonPromise.batchName='koton'
        kotonPromise.id='456'
        kotonPromise.retries=0
          const eventEmitter=  promiseConcurrency({batchConcurrency:2,rejectedRetry:3})
       
       
          eventEmitter.once('log_state',()=>{
                debugger;
                 assert.equal(eventEmitter.total.length,2,"total")
                 assert.equal(eventEmitter.queue.length,1, "queue")
                 assert.equal(eventEmitter.promises.length,1,"inProcess")
                debugger;
                 assert.equal(eventEmitter.resolved.length,0,"resolved")
                 assert.equal(eventEmitter.rejected.length,0,"rejected")
                 debugger;
             done()
         
        })
        eventEmitter.on('initStateSet',()=>{
         
            assert.equal(eventEmitter.total.length,2,"total")
            assert.equal(eventEmitter.queue.length,0, "queue")
            assert.equal(eventEmitter.promises.length,2,"inProcess")
            assert.equal(eventEmitter.resolved.length,0,"resolved")
            assert.equal(eventEmitter.rejected.length,0,"rejected")
          
            eventEmitter.emit('promiseRejected',defactoPromise)
        })
            eventEmitter.emit('initState',{total:[defactoPromise,kotonPromise],promises:[defactoPromise,kotonPromise]})
         
        } catch (error) {
            debugger;
            throw error
            //done()
        }
 
    })
    it.only('put rejected promise into rejected after three attepts', function(done){
        try {
            this.timeout(200000)
            debugger;
            const defactoPromise =()=>{
                return ({batchName,id})=>{
                   
                 
                    debugger
                }
        }
            defactoPromise.batchName='defacto'
            defactoPromise.id='123'
            defactoPromise.retries=3
            
        const kotonPromise =()=>{
            return ({batchName,id})=>{
                debugger
            }
        }
        kotonPromise.batchName='koton'
        kotonPromise.id='456'
        kotonPromise.retries=0
          const eventEmitter=  promiseConcurrency({batchConcurrency:2,rejectedRetry:3})
       
       
          eventEmitter.once('log_state',()=>{
                debugger;
                 assert.equal(eventEmitter.total.length,2,"total")
                 assert.equal(eventEmitter.queue.length,0, "queue")
                 assert.equal(eventEmitter.promises.length,1,"inProcess")
                debugger;
                 assert.equal(eventEmitter.resolved.length,0,"resolved")
                 assert.equal(eventEmitter.rejected.length,1,"rejected")
                 debugger;
             done()
         
        })
        eventEmitter.on('initStateSet',()=>{   

            assert.equal(eventEmitter.total.length,2,"total")
            assert.equal(eventEmitter.queue.length,0, "queue")
            assert.equal(eventEmitter.promises.length,2,"inProcess")
            assert.equal(eventEmitter.resolved.length,0,"resolved")
            debugger;
            assert.equal(eventEmitter.rejected.length,0,"rejected")

            eventEmitter.emit('promiseRejected',defactoPromise)
        })
            eventEmitter.emit('initState',{total:[defactoPromise,kotonPromise],promises:[defactoPromise,kotonPromise]})
         
        } catch (error) {
            debugger;
            throw error
            //done()
        }
 
    })
})