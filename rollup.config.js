import serve from 'rollup-plugin-serve';
import del from 'rollup-plugin-delete';
import html from '@open-wc/rollup-plugin-html';
import replace from '@rollup/plugin-replace';
import css from 'rollup-plugin-css-porter';
const makeDir = require('make-dir');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const production = !process.env.ROLLUP_WATCH;
const { pages } = require('./pages');
export default pages.map(p => {
  debugger;
  return pageBuilder({
    pageName: p.pageName,
    input: p.input,
    jsonUrl: p.jsonUrl,
    component: p.component,
    id: p.id
  });
});

function pageBuilder({ pageName, input, component, id, jsonUrl }) {
  return {
    external: ['df-product-view', 'addScriptTag'],
    input,
    output: {
      dir: `page-build/${path.dirname(pageName)}`,
      format: 'es',
      entryFileNames: 'main-[hash].js'
    },
    plugins: [
      css({ dest: `page-build/${path.dirname(pageName)}/main.css` }),
      replace({
        ENV: JSON.stringify(process.env.NODE_ENV)
      }),
      del({ targets: `page-build/${path.dirname(pageName)}/*.js` }),
      !production &&
        html({
          name: path.basename(pageName),
          inject: false,
          template({ bundle }) {
            return `
        <html>
          <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>
          ${bundle.entrypoints.map(bundle => {
            return `<script type="module" src=${bundle.importPath}></script>
            `;
          })}
          </head>
          <body>
          <${component} id=${id} jsonUrl=${jsonUrl}></${component}>
          </body>
        </html>
      `;
          }
        })
    ]
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
  
  return {
    name: 'prerender',
    options(inputOptions) {
      
    },
    async buildStart(inputOptions) {
      //void
      const { target, dest } = options;
      this.browser = await puppeteer.launch();
      const filePaths = fs.readdirSync(target).map((fileName) => {
        
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
        
      }))
      
    },
    resolveId(source, importer, options) {
      
      return null;
    },
    load(id) {
      this.addWatchFile(id);
      
      return null;
    },
    transform(code, id) {
      
      return null;
    },
    moduleParsed(moduleInfo) {
      //void

      
    },

    resolveDynamicImport() {
      
      return null;
    },

  async  buildEnd(error) {
      //void
      
        await this.browser.close()
      
    },
    //Output Generation Hooks
    closeBundle() {
      //void

      
    },
    outputOptions(outputOptions) {
      
      return null;
    },
    renderStart(outputOptions, inputOptions) {
      //void
      
    },
    banner() {
      //void

      
    },
    footer() {
      //void

      
    },
    intro() {
      //void

      
    },
    outro() {
      //void

      
    },
    renderDynamicImport() {
      
      return null;
    },
    resolveImportMeta() {
      
      return null;
    },
    augmentChunkHash() {
      
    },
    resolveFileUrl() {
      
      return null;
    },
    renderChunk(code, chunkinfo, outputOptions) {
      
    },
    generateBundle(outputOptions, bundle, isWrite) {
      //void

      
    },
    writeBundle(outputOptions, bundle) {
      //void

      
    },
    renderError() {
      //void

      
    },

    closeWatcher() {
      
    },
    watchChange(id, change) {
      
    },
  };
}

*/
