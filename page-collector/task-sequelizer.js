const EventEmitter = require('events');
class TaskListender extends EventEmitter {
    constructor({ tasks }) {
        super()

        this.on('taskComplete', (taskName) => {
      
            if (process.env.ALL === 'TRUE') {

                console.log('task complete', taskName)
                
                const completeTaskIndex = tasks.findIndex((element) => element.hasOwnProperty(taskName))
                if (completeTaskIndex + 1 < tasks.length) {
                    const nextTask = tasks.filter(t => Object.values(t)[0] === true).find((o, i) => i === completeTaskIndex + 1)
                    const nextTaskName = Object.keys(nextTask)[0]
                    
                    this.emit('nextTask', nextTaskName)
                    console.log('nextTask', nextTaskName)
                }

                
            } else {
                console.log('single task complete:', taskName)
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