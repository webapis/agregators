const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'esm',
  },
  plugins: [prerender({ target: './src/pages', dest: './build' })],
};

function prerender(options) {
  debugger;
  return {
    name: 'prerender',
    options(inputOptions) {
      debugger;
    },
    async buildStart(inputOptions) {
      //void
      const { target, dest } = options;
      const files = fs.readdirSync(target).map((fileName) => {
        debugger;
        return path.join(target, fileName);
      });
      debugger;
      this.browser = await puppeteer.launch();
      this.page = await this.browser.newPage();
      this.page.addScriptTag({ path: files[0] });

      await this.page.setContent('<home-page></home-page>', {
        waitUntil: 'domcontentloaded',
      });
      debugger;
      await this.page.waitForSelector('#root');
      debugger;
      await this.page.evaluate(() => {
        const elements = document.getElementsByTagName('script');
        for (var i = 0; i < elements.length; i++) {
          if (elements[i].type === '') {
            elements[i].parentNode.removeChild(elements[i]);
          }
        }
      });
      const content = await this.page.content();
      const removeParentTag = content
        .replace(/<\/home-page>/i, '')
        .replace(/<home-page>/i, '');
      const filename = path.basename(files[0], '.js');
      debugger;

      try {
        fs.writeFileSync(path.join(dest, `${filename}.html`), removeParentTag);
      } catch (error) {
        debugger;
        error;
      }

      debugger;
    },
    resolveId(source, importer, options) {
      debugger;
      return null;
    },
    load(id) {
      this.addWatchFile(id);
      debugger;
      return null;
    },
    transform(code, id) {
      debugger;
      return null;
    },
    moduleParsed(moduleInfo) {
      //void

      debugger;
    },

    resolveDynamicImport() {
      debugger;
      return null;
    },

    buildEnd(error) {
      //void

      debugger;
    },
    //Output Generation Hooks
    closeBundle() {
      //void

      debugger;
    },
    outputOptions(outputOptions) {
      debugger;
      return null;
    },
    renderStart(outputOptions, inputOptions) {
      //void
      debugger;
    },
    banner() {
      //void

      debugger;
    },
    footer() {
      //void

      debugger;
    },
    intro() {
      //void

      debugger;
    },
    outro() {
      //void

      debugger;
    },
    renderDynamicImport() {
      debugger;
      return null;
    },
    resolveImportMeta() {
      debugger;
      return null;
    },
    augmentChunkHash() {
      debugger;
    },
    resolveFileUrl() {
      debugger;
      return null;
    },
    renderChunk(code, chunkinfo, outputOptions) {
      debugger;
    },
    generateBundle(outputOptions, bundle, isWrite) {
      //void

      debugger;
    },
    writeBundle(outputOptions, bundle) {
      //void

      debugger;
    },
    renderError() {
      //void

      debugger;
    },

    closeWatcher() {
      debugger;
    },
    watchChange(id, change) {
      debugger;
    },
  };
}
