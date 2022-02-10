require('dotenv').config()

const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');


//BEFORE_ALL HOOK---------------------------------------------
BeforeAll({ timeout: 15000 }, async function () {
  try {
    const { launchPuppeteer } = require('./hooks/launchPuppeteer')
    const { clearScreenshots } = require('./hooks/clearScreenshots')
    await launchPuppeteer()
    clearScreenshots()
  } catch (error) {

    console.log('error', error)
    process.exit(1)
  }

});


//BEFORE HOOK------------------------------------------
Before({ timeout: 15000 }, async function (scenario) {
  try {

    const { setAppState } = require('./hooks/setAppState');
    const { initializePage } = require('./hooks/initializePage')
    const { mockGithubBranchesAndRepos } = require('./mocks/mock_github_branches_and_repos')
    await initializePage()
    await mockGithubBranchesAndRepos()
    await setAppState(scenario)
  } catch (error) {
    console.log('error', error)
    process.exit(1)
  }

})



//AFTER HOOK---------------------------------------
After({ timeout: 15000 }, async function (scenario) {
  try {
    const { saveAppState } = require('./hooks/saveAppState')
    await saveAppState(scenario)
    await global.page.close()
  } catch (error) {
    console.log('error', error)
    process.exit(1)
  }
})



//--AFTER_ALL HOOK---------------------------------------------START---------------------------------------
AfterAll(async function (error, result) {
  await global.browser.close();
  if (global.success >= 79) {
    process.exit(0)
  } else {
    process.exit(1)
  }
})

