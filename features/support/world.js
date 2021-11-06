const { setWorldConstructor, World } = require('@cucumber/cucumber')
const { launch } = require('./worldHelpers/puppeteer_helper')

class CustomWorld  {
    constructor() {
       
    }

    // Returns a promise that resolves to the element

}
CustomWorld.prototype.launch = launch
setWorldConstructor(CustomWorld)