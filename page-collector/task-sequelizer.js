const EventEmitter = require('events');
const {fbDatabase}=require('../utils/firebaseInit')
class TaskListender extends EventEmitter {
    constructor({ tasks }) {
        super()

        this.on('taskComplete', (taskName) => {

            const activeTasks = tasks.filter(t => Object.values(t)[0] === true)
            const completeTaskIndex = activeTasks.findIndex((element) => element.hasOwnProperty(taskName))
            const isLastTask = activeTasks[activeTasks.length - 1].hasOwnProperty(taskName)
              const taskRef =  fbDatabase.ref(`projects/${process.env.projectName}`)
            if (process.env.ALL === 'TRUE' && activeTasks.length > 1 && isLastTask === false) {
              taskRef.update({ [taskName]: true },()=>{
                    console.log('task complete', taskName)
                    if (completeTaskIndex + 1 < tasks.length) {
                        const nextTask = activeTasks.find((o, i) => i === completeTaskIndex + 1)
                        const nextTaskName = Object.keys(nextTask)[0]
                        
                        this.emit('nextTask', nextTaskName)
                        console.log('nextTask', nextTaskName)
                    } else {
                        this.emit('no_more_task')
                        process.exit(0)
                    }
                });

            } else {
                console.log('single task complete:', taskName)
                taskRef.update({ [taskName]: true },()=>{
                    process.exit(0)
                });
            }
        })

        this.on('taskError',(taskName)=>{

            process.exit(1)
        
        })
    }
}
function taskSequelizer({ tasks }) {
    const promiseEmitter = new TaskListender({ tasks });
    promiseEmitter.setMaxListeners(50);
    return promiseEmitter;

}

module.exports = { taskSequelizer }