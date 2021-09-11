const express = require('express');
const watch =require('node-watch')
const {copyComponents}=require('../page-collector/copyComponents')
const staticApp = express();
//const { pageBuilder } = require('../page-collector/pageBuilder');

//pageBuilder({taskSequelizerEventEmitter:null});
if (process.env.NODE_ENV === 'dev') {
  watch('src', { recursive: true }, function(evt, name) {
    console.log('%s changed.', name);
    copyComponents();
  });
}
staticApp.use(express.static('page-build'));

staticApp.listen(8082, async () => {
  console.log('Static Server started........... Press Ctrl+C to quit');
});
