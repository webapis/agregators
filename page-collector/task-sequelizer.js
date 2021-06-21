const EventEmitter = require('events');
class TaskListender extends EventEmitter {
    constructor({ tasks }) {
        super()

        this.on('taskComplete', (taskName) => {
            try {
                const completeTaskIndex = tasks.findIndex((element) => element.hasOwnProperty(taskName))
              const activeTasks =tasks.filter(t => Object.values(t)[0] === true)
              const isLastTask =activeTasks[activeTasks.length-1].hasOwnProperty(taskName)
              debugger;
            if (process.env.ALL === 'TRUE'  && activeTasks.length>1 && isLastTask===true) {

                console.log('task complete', taskName)
           
            
            
                if ( completeTaskIndex + 1 < tasks.length) {
                 
                    const nextTask = activeTasks.find((o, i) => i === completeTaskIndex + 1)
                 
                    const nextTaskName = Object.keys(nextTask)[0]
                 
                    this.emit('nextTask', nextTaskName)
                    console.log('nextTask', nextTaskName)
                }else{
              
                    this.emit('no_more_task')
                    process.exit(0)
                }

                
            } else {
                console.log('single task complete:', taskName)
             process.exit(0)
            }  
            } catch (error) {
                debugger;
            }
      


        })
    }
}
function taskSequelizer({ tasks }) {
    const promiseEmitter = new TaskListender({ tasks });
    promiseEmitter.setMaxListeners(50);
    return promiseEmitter;

}

module.exports = { taskSequelizer }