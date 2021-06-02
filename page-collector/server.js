const fs = require('fs');
//const request = require('request');
const { walkSync } = require('./walkSync');
const { removeDerectory } = require('./removeDerectory');
const path = require('path');
//const nodeUrl = require('url');
const makeDir = require('make-dir');
//const puppeteer = require('puppeteer');

const { workerService } = require('./workerService');
const { pageGeneration } = require('./pageGenerator');
const { pageScriptAttacher } = require('./pageScriptAttacher');
const { pageComponentAttacher } = require('./pageComponentAttacher');
const { pageBuilder } = require('./pageBuilder');
const { pageNavigationItems } = require('./pageNavigationItems');
//const { diff_minutes } = require('./diff_time');
const { batchPageCollector } = require('./batchPageCollector');
const { batchDataCollector } = require('./batchDataCollector');
const { batchImageCollection } = require('./batchImageCollection');
const ws_domain = 'tr/moda';

async function batchImageProcessing({
  imageWidth,
  script,
  folderName,
  batch = 100
}) {
  let queque = [];

  console.log('start....');
  walkSync(`${process.cwd()}/${folderName}/${ws_domain}`, async function(
    filepath
  ) {
    if (!filepath.includes('.DS_Store')) {
      queque.push(filepath);
    }
  });
  let i;

  let promises = [];
  for (i = 0; i <= queque.length; i += batch) {
    const nextSlice = queque.slice(i, i + batch);
    promises.push(
      workerService({
        workerData: { nextSlice, index: i, imageWidth },
        script
      })
    );
  }
  await Promise.all(promises);
  console.log('queque', queque.length);

  console.log('end....');
}

function navDataTree() {
  let files = [];
  console.log('nav data tree creation started....');
  walkSync(`${process.cwd()}/page-data/${ws_domain}`, async function(filepath) {
    if (!filepath.includes('.DS_Store')) {
      //files.push(filepath);
      files.push(filepath.substring(filepath.indexOf('moda/')));
    }
  });
  let recures = true;
  let reduced = [];

  const withoutdub = getTrees({ files, reduced });

  withoutdub.forEach(w => {
    const { files, filter } = w;
    // const filePath = `${process.cwd()}/page-data/tr/${filter}`;
    const pathNames = filter.split('/').filter(f => f !== '');
    const fileName = pathNames[pathNames.length - 1];
    let mergedData = [];

    files.forEach(f => {
      const filePath = `${process.cwd()}/page-data/tr/${f}`;

      const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
      const dataObject = JSON.parse(data);
      mergedData.push(...dataObject);
    });
    const output = `${process.cwd()}/page-tree/tr/${filter}`;
    makeDir.sync(output);
    const outputFilePath = `${output}${fileName}.json`;

    fs.writeFileSync(outputFilePath, JSON.stringify(mergedData));
  });

  console.log('nav data tree creation ended....');
}
function getTrees({ files, reduced }) {
  let i = 0;

  while (i < files.length) {
    const ps = files[i];
    const index = files[i].split('/');
    let s = 1;
    let filter;
    for (s; s < index.length; s++) {
      const curr = ps.indexOf(index[s]);
      filter = ps.substr(0, curr);
      reduced = [
        ...reduced,
        { files: files.filter(f => f.includes(filter)), filter }
      ];
    }
    i++;
  }

  return reduced.reduce((acc, curr, i) => {
    if (i === 0) {
      return [curr];
    }
    if (acc.findIndex(e => e.filter === curr.filter) === -1) {
      return [...acc, curr];
    }

    return acc;
  }, []);
}

function pageLeaves() {
  let files = [];
  console.log('page tree creation started....');
  walkSync(`${process.cwd()}/page-tree/${ws_domain}`, async function(filepath) {
    if (!filepath.includes('.DS_Store')) {
      files.push(filepath);
    }
  });
  const sorted = files.sort();
  sorted.forEach(s => {
    const data = fs.readFileSync(s);
    const dataObject = JSON.parse(data);
    const filename = path.basename(s, '.json');
    const outputDir = path.dirname(s).replace('page-tree', 'page-leave');
    const outputDir2 = outputDir.substring(0, outputDir.lastIndexOf('/'));
    makeDir.sync(outputDir);
    let i;
    let count = 0;

    for (i = 0; i < dataObject.length; i += 100) {
      const outoutFilePath = `${outputDir2}/${filename}-${count}.json`;
      const slice = dataObject.slice(i, i + 100);
      fs.writeFileSync(outoutFilePath, JSON.stringify(slice));
      count++;
    }
  });

  console.log('page tree creation ended....');
}

const env = process.env.NODE_ENV;

env === 'page_collection' &&
  removeDerectory('page-collection') & batchPageCollector();
env === 'page_data_collection' &&
  removeDerectory('page-data') & batchDataCollector();

env === 'page_image_collection' &&
  removeDerectory('page-image') & batchImageCollection();

env === 'page_image_crop' &&
  removeDerectory('page-image-resized') &&
  batchImageProcessing({
    imageWidth: 288,
    folderName: 'page-image',
    script:
      '/Users/personalcomputer/actors/page-collector/image-processes/2-cropImages.js'
  });
env === 'page_image_blur' &&
  removeDerectory('page-image-blurred') &&
  batchImageProcessing({
    imageWidth: 288,
    folderName: 'page-image-resized',
    script:
      '/Users/personalcomputer/actors/page-collector/image-processes/3-blurImages.js'
  });
env === 'page_image_embed' &&
  batchImageProcessing({
    imageWidth: 288,
    folderName: 'page-data',
    batch: 2,
    script:
      '/Users/personalcomputer/actors/page-collector/image-processes/4-embedImages.js'
  });

env === 'page_nav_data_tree_creation' &&
  removeDerectory('page-tree') &&
  navDataTree();
env === 'page_leaves_creation' && removeDerectory('page-leave') && pageLeaves();
env === 'page_generation' &&
  removeDerectory('page-list-pages') &&
  pageGeneration() &&
  pageComponentAttacher({
    source: `
    <product-list></product-list>
    <prerender-component></prerender-component>
    `,
    innterHtmlTo: 'body',
    inputFolder: 'page-list-pages'
  }) &&
  pageScriptAttacher({
    source: [
      'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css'
    ],
    inputFolder: 'page-list-pages',
    prop: 'href',
    tag: 'link',
    appendTo: 'head',
    rel: 'stylesheet',
    cdn: true
  }) &&
  pageScriptAttacher({
    source: ['/components/nav.css'],
    inputFolder: 'page-list-pages',
    prop: 'href',
    tag: 'link',
    appendTo: 'head',
    rel: 'stylesheet',
    cdn: false
  }) &&
  pageScriptAttacher({
    source: [
      '/components/product-list/product-list.js',
      '/components/product-list/prerender-component.js'
    ],
    inputFolder: 'page-list-pages',
    prop: 'src',
    tag: 'script',
    appendTo: 'body',
    cdn: false
  }); //&&
// pageScriptAttacher({
//   source: [
//     'https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js'
//   ],
//   inputFolder: 'page-list-pages',
//   prop: 'src',
//   tag: 'script',
//   appendTo: 'body',
//   cdn: true
// });
env === 'page_nav_items' && pageNavigationItems();
env === 'page_builder' && removeDerectory('page-build') && pageBuilder();