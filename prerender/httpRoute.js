const path = require('path');
const Apify = require('apify');
const fs = require('fs');
const { prerender } = require('./prerender');
const parallel = 72;

function httpRoute(browser) {
  return async function (req, res) {
    try {
      req.browser = browser;
      
      req.browser = browser;
      const { url } = req;
      console.log('url recieved', url);
      var str = '';

      //another chunk of data has been received, so append it to `str`
      req.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been received, so we just print it out here
      req.on('end', async function () {
        
        req.body = JSON.parse(str);
        prerender({ req });
        debugger;
      });

      res.statusCode = 200;
      res.write('Hello World!'); //write a response to the client
      res.end(); //end the response
    } catch (error) {
      debugger;
      throw error;
    }
  };
}

module.exports = {
  httpRoute,
};
