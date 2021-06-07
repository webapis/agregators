const core = require('@actions/core');
const {
  defactoKadynJeanMetaData
} = require('../../../page-meta-creator/defacto/kadin/jean/defacto.kadyn.jean.metadata');
try {
  defactoKadynJeanMetaData();
} catch (error) {
  core.setFailed(error.message);
}
