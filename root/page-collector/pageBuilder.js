const fs = require('fs');
var watch = require('node-watch');
const { walkSync } = require('./walkSync');
const makeDir = require('make-dir');
const path = require('path');
const { copyComponents } = require('./copyComponents');

function pageBuilder({taskSequelizerEventEmitter={}}) {
  console.log('PAGE BUILD STARTED....');
  copyComponents();
  copyFiles({
    source: `page-leave`,
    destination: 'page-build'
  });
  copyFiles({
    source: `page-list-pages`,
    destination: 'page-build'
  });
  copyFiles({
    source: `page-navigation`,
    destination: 'page-build'
  });
  copyFiles({
    source: `page-image-resized`,
    destination: 'page-build'
  });

  if (process.env.NODE_ENV === 'dev') {
    watch('src', { recursive: true }, function(evt, name) {
      console.log('%s changed.', name);
      copyComponents();
    });
 
    watch('page-navigation', { recursive: true }, function(evt, name) {
      console.log('%s changed.', name);
      copyFiles({
        source: `page-navigation`,
        destination: 'page-build'
      });
    });

  }

  console.log('PAGE BUILD ENDED....');
  taskSequelizerEventEmitter && taskSequelizerEventEmitter.emit('taskComplete', 'page_builder')
}

function copyFiles({ source, destination }) {
  console.log(`copy files from ${source} to ${destination} started....`);
  walkSync(`${process.cwd()}/${source}`, async function(filepath) {
    if (!filepath.includes('.DS_Store')) {
      const newDestination = filepath.replace(source, destination);

      makeDir.sync(path.dirname(newDestination));
      fs.copyFileSync(filepath, newDestination);
    }
  });
  console.log(`copy files from ${source} to ${destination} ended....`);
}

module.exports = { pageBuilder };
