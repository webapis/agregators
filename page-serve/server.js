const express = require('express');
const staticApp = express();
staticApp.use(express.static('page-build'));
staticApp.listen(8082, async () => {
  console.log('Static Server started........... Press Ctrl+C to quit');
});
