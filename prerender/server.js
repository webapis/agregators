require('dotenv').config();
const puppeteer = require('puppeteer');
const { httpRoute } = require('./httpRoute');

const Apify = require('apify');

const axios = require('axios');
const http = require('http');
const defactoPrerenderItems = require('./defacto/defactoPrerenderItems');
//const { firstPageUrls } = require('../scrape/firstPageUrls');
// const prerenderUrls = firstPageUrls.find(f => f.marka === process.env.MARKA)
//   .firstPageUrls;
debugger;

// puppeteer
//   .launch()
//   .then(browser => {
//     const server = http.createServer(httpRoute(browser));
//     server.listen(3000, function() {
//       console.log('listening on port 3000');
//     });
//   })
//   .then(async () => {
//     axios
//       .post('http://localhost:3000', {
//         componentPath: 'src/pages/home-page.js',
//         output,
//         items: nextItems,
//         pageName
//       })
//       .then(res => {
//         console.log(`statusCode: ${res.status}`);
//       })
//       .catch(error => {
//         console.error(error);
//       });

//     return new Promise(resolve => resolve(12));
//   });
