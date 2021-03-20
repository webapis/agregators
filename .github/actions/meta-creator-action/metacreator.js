const core = require('@actions/core');
const github = require('@actions/github');
const {
  defactoKadynJeanMetaData
} = require('../../../page-meta-creator/defacto/kadin/jean/defacto.kadyn.jean.metadata');
try {
  const pageData = core.getInput('pageData');
  console.log('pageData length inside creator action', pageData.length);
  // const data = defactoKadynJeanMetaData(pageData).then(pageMete => {
  //   core.setOutput('pageMeta', data['pantolonPage']);
  //});
} catch (error) {
  core.setFailed(error.message);
}
