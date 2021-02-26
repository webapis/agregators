require('dotenv').config();
const puppeteer = require('puppeteer');
const { httpRoute } = require('./httpRoute');
const fs = require('fs');
const path = require('path');
const Apify = require('apify');
const parallel = 72;
const axios = require('axios');
const http = require('http');
puppeteer
  .launch()
  .then((browser) => {
    debugger;
    const server = http.createServer(httpRoute(browser));
    server.listen(3000, function () {
      console.log('listening on port 3000');
    });
  })
  .then(() => {
    debugger;
    axios
      .post('http://localhost:3000', {
        componentPath: 'src/pages/home-page.js',
        output: 'build',
        items: [],
        pageName: '',
      })
      .then((res) => {
        debugger;
        console.log(`statusCode: ${res.status}`);
      })
      .catch((error) => {
        debugger;
        console.error(error);
      });
  });

//
// async function prerender({ target = './src/pages', dest = './build' }) {
//   //void

//   this.browser = await puppeteer.launch();
//   const filePaths = fs.readdirSync(target).map((fileName) => {
//     debugger;
//     return path.join(target, fileName);
//   });

//   await Promise.all(
//     filePaths.map(async (filePath) => {
//       const filename = path.basename(filePath, '.js');
//       const page = await this.browser.newPage();
//       await page.addScriptTag({ path: filePath });
//       await page.setContent(`<${filename}></${filename}>`, {
//         waitUntil: 'domcontentloaded',
//       });
//       await page.waitForSelector('#root');
//       debugger;
//       await page.evaluate(() => {
//         const elements = document.getElementsByTagName('script');
//         for (var i = 0; i < elements.length; i++) {
//           if (elements[i].type === '') {
//             elements[i].parentNode.removeChild(elements[i]);
//           }
//         }
//       });
//       const content = await page.content();
//       const removeParentTag = content
//         .replace(`<${filename}>`, '')
//         .replace(`</${filename}>`, '');
//       fs.writeFileSync(path.join(dest, `${filename}.html`), removeParentTag);
//       debugger;
//     })
//   );

// }

// prerender({ target: './src/pages', dest: './build' });

/*
require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const Apify = require('apify');
const parallel = 72;
async function prerender() {
  try {
    const dataset = await Apify.openDataset('pageUrls');
    const { items } = await dataset.getData();
    for (const item of items) {
      const {
        mainMenu: { mainMenuTitle },
        subMenu,
      } = item;
      for (const s of subMenu) {
        const { subMenuTitle, urls } = s;
        for (const u of urls) {
          const promises = [];
          const { url, urlTitle } = u;
          const dataSetName = `${mainMenuTitle}.${subMenuTitle}.${urlTitle}`;
          const dataset = await Apify.openDataset(dataSetName);
          const { items } = await dataset.getData();
          for (let i = 0; i < items.length; i += parallel) {
            debugger;
            
          }
          debugger;
        }
        debugger;
      }
      debugger; //
    }
    debugger;
  } catch (error) {
    debugger;
    throw error;
  }
}
prerender();
*/
