const core = require('@actions/core');
const github = require('@actions/github');
const {
  defactoKadynJeanMetaData
} = require('../../../page-meta-creator/defacto/kadin/jean/defacto.kadyn.jean.metadata');
try {
  defactoKadynJeanMetaData();
} catch (error) {
  core.setFailed(error.message);
}
