const { setWorldConstructor, World } = require('@cucumber/cucumber')


class CustomWorld  {
    constructor() {
       
    }

    // Returns a promise that resolves to the element

}

setWorldConstructor(CustomWorld)