const { Before, After } = require('@cucumber/cucumber');

Before(async function () {

await this.launch()
this.page = await this.browser.newPage()
this.page.goto('http://localhost:3000')
  // perform some shared setup
});

After(async function(){
  await this.browser.close()
})

Before({tags:'@signin'},async function (){
  await this.page.waitForSelector('home-card > div > a')
  await this.page.click('home-card > div > a')
})