const axios = require('axios');
function publish() {
  axios('https://api.vercel.com/v12/now/deployments', {
    method: 'POST',
    data: {
      name: 'aggregator-app-first2021',
      files: [
        {
          file: 'index.html',
          data:
            '<!doctype html>\n<html>\n  <head>\n    <title>A simple deployment with the Vercel API!</title>\n  </head>\n  <body>\n    <h1>Welcome to a simple static file</h1>\n    <p>Deployed with <a href="/docs/api">the Vercel API</a>!</p>\n    </body>\n</html>'
        }
      ],
      projectSettings: {
        framework: null
      }
    },
    Headers: {
      'Access-Control-Request-Method': 'POST',
      'Content-Type': 'application/json',
      Authorization: 'Bearer u8Pd4JAVEVlNfpeSFjKD6ywi'
    }
  })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
}
publish();
//module.exports = { publish };
