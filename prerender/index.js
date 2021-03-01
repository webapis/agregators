require('dotenv').config();
const puppeteer = require('puppeteer');
const { httpRoute } = require('./httpRoute');

const Apify = require('apify');
const parallel = 72;
const axios = require('axios');
const http = require('http');
puppeteer
  .launch()
  .then((browser) => {
    const server = http.createServer(httpRoute(browser));
    server.listen(3000, function () {
      console.log('listening on port 3000');
    });
  })
  .then(async () => {
    const dataset = await Apify.openDataset('pageUrls');
    const { items } = await dataset.getData();

    await Promise.all(
      items.map(async (item) => {
        const {
          mainMenu: { mainMenuTitle },
          subMenu,
        } = item;

        await Promise.all(
          subMenu.map(async (s) => {
            const { subMenuTitle, urls } = s;

            await Promise.all(
              urls.map(async (u) => {
                const { url, urlTitle } = u;
                const dataSetName = `${mainMenuTitle}.${subMenuTitle}.${urlTitle}`;
                const dataset = await Apify.openDataset(dataSetName);
                const { items } = await dataset.getData();
                if (items.length > 0) {
                  for (let i = 0; i < 72; i += parallel) {
                    debugger;
                    const nextItems = items.slice(i, i + parallel);
                    const pageName =
                      url.substring(url.lastIndexOf('/') + 1) +
                      `-${i}-${i + parallel}`;
                    const output = `build/${url.replace(
                      'https://www.defacto.com.tr/',
                      ''
                    )}`;

                    axios
                      .post('http://localhost:3000', {
                        componentPath: 'src/pages/home-page.js',
                        output,
                        items: nextItems,
                        pageName,
                      })
                      .then((res) => {
                        console.log(`statusCode: ${res.status}`);
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  }
                }
              })
            );
          })
        );
      })
    );

    return new Promise((resolve) => resolve(12));
  });
