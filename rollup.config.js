import serve from 'rollup-plugin-serve';
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'esm',
  },
  plugins: [
    prerender({ target: './src/pages', dest: './build' }),
    serve({
      open: true,
      contentBase: 'build',
      // openPage: 'build/home-page',
      host: 'localhost',
      port: 10001,
    }),
  ],
};

function prerender(options) {
  debugger;
  return {
    name: 'prerender',
    options(inputOptions) {
      console.log('options');
      debugger;
    },
    async buildStart(inputOptions) {
      //void
      const { target, dest } = options;
      this.browser = await puppeteer.launch();
      const filePaths = fs.readdirSync(target).map((fileName) => {
        debugger;
        return path.join(target, fileName);
      });
      const self = this;
      await Promise.all(
        filePaths.map(async (filePath) => {
          self.addWatchFile(filePath);
          const filename = path.basename(filePath, '.js');
          const page = await this.browser.newPage();
          await page.addScriptTag({ path: filePath });
          await page.setContent(`<${filename}></${filename}>`, {
            waitUntil: 'domcontentloaded',
          });
          await page.waitForSelector('#root');
          debugger;
          await page.evaluate(() => {
            const elements = document.getElementsByTagName('script');
            for (var i = 0; i < elements.length; i++) {
              if (elements[i].type === '') {
                elements[i].parentNode.removeChild(elements[i]);
              }
            }
          });
          const content = await page.content();
          const removeParentTag = content
            .replace(`<${filename}>`, '')
            .replace(`</${filename}>`, '');
          fs.writeFileSync(
            path.join(dest, `${filename}.html`),
            removeParentTag
          );
          debugger;
        })
      );
      debugger;
    },
    resolveId(source, importer, options) {
      debugger;
      //return null;
    },
    load(id) {
      this.addWatchFile(id);
      debugger;
      //  return null;
    },
    transform(code, id) {
      debugger;
      //  return null;
    },
    moduleParsed(moduleInfo) {
      //void

      debugger;
    },

    resolveDynamicImport() {
      debugger;
      // return null;
    },

    async buildEnd(error) {
      //void
      await this.browser.close();
      debugger;
    },
    //Output Generation Hooks
    closeBundle() {
      //void

      debugger;
    },
    outputOptions(outputOptions) {
      debugger;
      // return null;
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
      // return null;
    },
    resolveImportMeta() {
      debugger;
      // return null;
    },
    augmentChunkHash() {
      debugger;
    },
    resolveFileUrl() {
      debugger;
      // return null;
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
      console.log('closeWatcher');
      debugger;
    },
    watchChange(id, change) {
      debugger;
    },
  };
}

/*
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
      this.browser = await puppeteer.launch();
      const filePaths = fs.readdirSync(target).map((fileName) => {
        debugger;
        return path.join(target, fileName);
      });
      await Promise.all(filePaths.map(async(filePath)=>{
        const filename = path.basename(filePath, '.js');
        const page = await this.browser.newPage();
        await page.addScriptTag({ path: filePath });
        await page.setContent(`<${filename}></${filename}>`, {
          waitUntil: 'domcontentloaded',
        });
        await page.waitForSelector('#root');
        debugger;
        await page.evaluate(() => {
          const elements = document.getElementsByTagName('script');
          for (var i = 0; i < elements.length; i++) {
            if (elements[i].type === '') {
              elements[i].parentNode.removeChild(elements[i]);
            }
          }
        });
        const content = await page.content();
     
        const removeParentTag = content
          .replace(`<${filename}>`, '')
          .replace(`</${filename}>`, '');
          fs.writeFileSync(path.join(dest, `${filename}.html`), removeParentTag);
        debugger;
      }))
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

  async  buildEnd(error) {
      //void
      debugger;
        await this.browser.close()
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

*/
