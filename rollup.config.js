import serve from 'rollup-plugin-serve';
import del from 'rollup-plugin-delete'
import html from '@open-wc/rollup-plugin-html';
const makeDir = require('make-dir');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

export default {
  external: ['df-product-view'],
  input: 'src/main.js',
  output: {
    dir: 'build',
    format: 'es',
    entryFileNames: 'main-[hash].js'
  },
  plugins: [
    del({ targets: 'build/*.js' }),
    html({
      name: 'index.html',
      inject: false,
      template({ bundle }) {
        debugger;
        return `
        <html>
          <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
            ${bundle.entrypoints.map(bundle => {
              debugger;
              return `<script type="module" src=${bundle.importPath}></script>`;
            })}
          </head>
        </html>
      `;
      }
    }),
    watchComponent({ target: 'src/components', dest: 'build/components' }),
    serve({
      open: false,
      contentBase: 'build',
      // openPage: 'build/home-page',
      host: 'localhost',
      port: 10001
    })
  ]
};

function watchComponent(options) {
  debugger;
  return {
    name: 'watchComponent',

    async buildStart(inputOptions) {
      const { target, dest } = options;
      debugger;
      await makeDir(dest);
      let self = this;
      const filePaths = fs.readdirSync(target).map(function(fileName) {
        const filePath = path.join(target, fileName);
        const file = fs.readFileSync(filePath);
        debugger;
        fs.writeFileSync(path.join(dest, fileName), file);
        const pathResolved = path.resolve(filePath);
        self.addWatchFile(pathResolved);
        debugger;
      });
      debugger;
    }
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
