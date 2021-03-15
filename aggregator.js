require('dotenv').config();
const { Scraper } = require('./scrape/main');
console.log('agregator');
Scraper()
  .then(result => {
    console.log('Scraping result', result);
    debugger;
  })
  .catch(error => {
    console.log('error', error);
    debugger;
  });
