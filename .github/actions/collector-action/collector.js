const core = require('@actions/core');
const github = require('@actions/github');
const { pageContentReader } = require('../../../page-data-reader');
const {
  defactoNextPageUrls
} = require('../../../page-data-reader/defacto/defactoNextPageUrls');
const {
  defactoPageHandler
} = require('../../../page-data-reader/defacto/defactoPageHandler');
try {
  // `who-to-greet` input defined in action metadata file
  const pageUrl = core.getInput('page-url');
  console.log(`pageUrl ${pageUrl}!`);
  const time = new Date().toTimeString();
  core.setOutput('time', time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  pageContentReader({
    url: pageUrl,
    pageHandler: defactoPageHandler,
    pageUrlsGetter: defactoNextPageUrls
  }).then(pageData => {
    console.log('PageTitle', pageData.pageTitle);
    core.setOutput('pageData', pageData);
  });
} catch (error) {
  core.setFailed(error.message);
}

/*
const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
*/
