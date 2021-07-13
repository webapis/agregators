
const {promiseConcurrency}= require('../index')

//controls batch concurrency
//controls total concurrency
//retries rejected promises
//logs state
describe('testing promise concurrency', function(){

    it.skip('promise concurrency test', function(){
        this.timeout(200000)
        debugger;
        promiseConcurrency({batchConcur:2,totalConcur:3,rejectedRetry:3})
        debugger;
    })

})