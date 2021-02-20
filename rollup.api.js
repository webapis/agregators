const inputOptions = {
  input: 'src/main.js',
  plugins: [prerender(), another()],
};
const outputOptions = { file: 'bundle.js', format: 'cjs' };
const rollup = require('rollup');

async function build() {
  const bundle = await rollup.rollup(inputOptions);
  console.log(bundle.watchFiles);
  await bundle.generate(outputOptions);
  await bundle.write(outputOptions);
  await bundle.close();
}
function watch() {
  rollup.watch(...inputOptions, (output: [outputOptions]));
}
function prerender(options) {
  return {
    name: 'prerender',
    options(inputOptions) {
      const args = arguments;
      debugger;
    },
    async buildStart(options) {
      const args = arguments;
      debugger;
    },
    resolveId(source, importer, options) {
      const args = arguments;
      debugger;
    },
    load(id) {
      const args = arguments;
      this.addWatchFile(id);
      debugger;
    },
    transform(code, id) {
      const args = arguments;
      debugger;
    },
    moduleParsed(moduleInfo) {
      const args = arguments;
      debugger;
    },

    resolveDynamicImport() {
      const args = arguments;
      debugger;
    },

    buildEnd(error) {
      const args = arguments;
      debugger;
    },
    //Output Generation Hooks
    closeBundle() {
      const args = arguments;
      debugger;
    },
    outputOptions(outputOptions) {
      const args = arguments;
      debugger;
    },
    renderStart(outputOptions, inputOptions) {
      const args = arguments;
      debugger;
    },
    banner() {
      const args = arguments;
      debugger;
    },
    footer() {
      const args = arguments;
      debugger;
    },
    intro() {
      const args = arguments;
      debugger;
    },
    outro() {
      const args = arguments;
      //  debugger;
    },
    renderDynamicImport() {
      const args = arguments;
      debugger;
    },
    resolveImportMeta() {
      const args = arguments;
      debugger;
    },
    augmentChunkHash() {
      const args = arguments;
      debugger;
    },
    resolveFileUrl() {
      const args = arguments;
      debugger;
    },
    renderChunk(code, chunkinfo, outputOptions) {
      const args = arguments;
      debugger;
    },
    generateBundle(outputOptions, bundle, isWrite) {
      const args = arguments;
      //  debugger;
    },
    writeBundle(outputOptions, bundle) {
      const args = arguments;
      debugger;
    },
    renderError() {
      const args = arguments;
      debugger;
    },

    closeWatcher() {
      const args = arguments;
      debugger;
    },
    watchChange(id, change) {
      const args = arguments;
      debugger;
    },
  };
}

function another(options) {
  return {
    name: 'another',
    options(inputOptions) {
      //another
      const args = arguments;
      debugger;
    },
    async buildStart(options) {
      //another
      const args = arguments;
      debugger;
    },
    resolveId(source, importer, options) {
      //another
      const args = arguments;
      debugger;
    },
    load(id) {
      //another
      const args = arguments;
      this.addWatchFile(id);
      debugger;
    },
    transform(code, id) {
      //another
      const args = arguments;
      debugger;
    },
    moduleParsed(moduleInfo) {
      //another
      const args = arguments;
      debugger;
    },

    resolveDynamicImport() {
      //another
      const args = arguments;
      debugger;
    },

    buildEnd(error) {
      //another
      const args = arguments;
      debugger;
    },
    //Output Generation Hooks
    closeBundle() {
      //another
      const args = arguments;
      debugger;
    },
    outputOptions(outputOptions) {
      //another
      const args = arguments;
      debugger;
    },
    renderStart(outputOptions, inputOptions) {
      //another
      const args = arguments;
      debugger;
    },
    banner() {
      //another
      const args = arguments;
      debugger;
    },
    footer() {
      //another
      const args = arguments;
      debugger;
    },
    intro() {
      //another
      const args = arguments;
      debugger;
    },
    outro() {
      //another
      const args = arguments;
      //  debugger;
    },
    renderDynamicImport() {
      //another
      const args = arguments;
      debugger;
    },
    resolveImportMeta() {
      //another
      const args = arguments;
      debugger;
    },
    augmentChunkHash() {
      //another
      const args = arguments;
      debugger;
    },
    resolveFileUrl() {
      //another
      const args = arguments;
      debugger;
    },
    renderChunk(code, chunkinfo, outputOptions) {
      //another
      const args = arguments;
      debugger;
    },
    generateBundle(outputOptions, bundle, isWrite) {
      //another
      const args = arguments;
      //  debugger;
    },
    writeBundle(outputOptions, bundle) {
      //another
      const args = arguments;
      debugger;
    },
    renderError() {
      //another
      const args = arguments;
      debugger;
    },

    closeWatcher() {
      //another
      const args = arguments;
      debugger;
    },
    watchChange(id, change) {
      //another
      const args = arguments;
      debugger;
    },
  };
}

build();
