const express = require('express');

const staticApp = express();
const { pageBuilder } = require('../page-collector/pageBuilder');

pageBuilder();

staticApp.use(express.static('page-build'));

staticApp.listen(8082, async () => {
  console.log('Static Server started........... Press Ctrl+C to quit');
});
