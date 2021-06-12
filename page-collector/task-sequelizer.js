const EventEmitter = require('events');
class taskListender extends EventEmitter{
    constructor({tasks}){
        super()

        this.on('taskComplete',(taskName)=>{

            

        })
    }
}
function taskSequelizer({eventName}){
debugger;
}

module.exports={taskSequelizer}