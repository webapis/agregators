require('dotenv').config();
const Apify = require('apify');
const puppeteer = require('puppeteer');
async function navigationBuilder() {
  const dataset = await Apify.openDataset('pageUrls');
  const { items } = await dataset.getData();
  debugger;
  const browser = await puppeteer.launch();

}

navigationBuilder();
