

const {taskSequelizer}=require('../task-sequelizer')
const assert = require('assert')
const {projects}=require('../project.config')
describe('TaskSequelizer description',function(){
    it('testing task sequelizer',function(done){
        const taskSequelizerEvent = taskSequelizer({tasks:projects['defacto']})
        taskSequelizerEvent.on('nextTask', function(nextTaskName){
            assert.equal('page_image_blur',nextTaskName)
            done()
         
        })
        taskSequelizerEvent.emit('taskComplete',"page_image_crop")
       
    })
})