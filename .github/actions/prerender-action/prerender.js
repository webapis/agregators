// const fs = require('fs');
// const makeDir = require('make-dir');
const core = require('@actions/core');
const {
  prerender
} = require(`${process.cwd()}/page-prerender/defacto/index.js`);

async function prerenderAction() {
  try {
    const content = await prerender();
    console.log('prerendered');
  } catch (error) {
    core.setFailed(error.message);
  }
}
prerenderAction();
