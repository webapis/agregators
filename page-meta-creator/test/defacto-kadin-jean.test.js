const {
  defactoKadynJeanMetaData
} = require('../defacto/kadin/jean/defacto.kadyn.jean.metadata');

const fs = require('fs');
const makeDir = require('make-dir');

describe('Defacto Kadin Jean Meta creator', () => {
  it('test defactoKadynJeanMetaData ', async function() {
    this.timeout(50000);
    debugger;
    const data = await defactoKadynJeanMetaData();
    debugger;

    debugger;
  });
});
