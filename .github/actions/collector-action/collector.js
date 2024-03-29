const core = require('@actions/core');
const github = require('@actions/github');
const { collector } = require('../../../page-collector/server');
const {
  defactoNextPageUrls
} = require('../../../page-data-collector/defacto/defactoNextPageUrls');
const {
  defactoDataCollector
} = require('../../../page-data-collector/defacto/defactoDataCollector');
try {
  const projectName = core.getInput('projectName');

  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2);
  // pageDataCollector({
  //   url: pageUrl,
  //   dataCollector: defactoDataCollector,
  //   pageUrlsGetter: defactoNextPageUrls
  // });
} catch (error) {
  core.setFailed(error.message);
}
