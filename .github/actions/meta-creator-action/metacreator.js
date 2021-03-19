const core = require('@actions/core');
const github = require('@actions/github');
const {
    defactoKadynJeanMetaData
  } = require('../../../page-meta-creator/defacto/kadin/jean/defacto.kadyn.jean.metadata');
try {
  const pageData =core.getInput('pageData');
    const data = await defactoKadynJeanMetaData(pageData);
    return data['pantolonPage']

} catch (error) {
  core.setFailed(error.message);
}