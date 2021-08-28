require('dotenv').config()
const http = require('http');
const path = require('path');
const urlParser = require('url')
const { exchangeCodeForAccessToken } = require('./utils/oauth2/server/server.oauth2')
const dirPath = path.join(__dirname, `/src/${process.env.app}/`);
const port = process.env.PORT || 3000;
const client_id = process.env.client_id
const client_secret = process.env.client_secret
const serveStatic = require('./server/serve-static')
const { fetchGithubAuthCode, fetchGithubAccessToken } = require('./utils/github')
const REDIRECT_URL = (process.env.SERVER === 'LOCAL_SERVER' || process.env.SERVER === 'LOCAL') ? process.env.DEV_REDIRECT_URL : process.env.PRODUCTION_REDIRECT_URL
debugger;
const server = http.createServer((req, res) => {
    const { url } = req

    res.statusCode = 200;
    switch (true) {

        case /.*\/user-settings.html\?state=.*/.test(url):
            const redirectpath = dirPath + 'user-settings.html'
            exchangeCodeForAccessToken({ client_id, client_secret, code: getUrlParams(url).code, redirect_uri: REDIRECT_URL, res, filepath: redirectpath })
            break;
        case /github-verification.html\?.*/.test(url):
            const uidparam = urlParser.parse(url, true).query.uid
            res.uid = uidparam
            debugger;
            fetchGithubAuthCode(res)
            debugger;
            break;
        case /user-settings.html\?code=.*/.test(url):
            const { code: codeparam, state } = urlParser.parse(url, true).query
            res.uid = state
            debugger;
            fetchGithubAccessToken(codeparam, res)
            debugger;
            break;

        default:

            serveStatic(req, res)
    }
})

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



function getUrlParams(url) {

    // Parse query string to see if page request is coming from OAuth 2.0 server.
    var params = {};
    var regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(url)) {

        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);

    }

    return params
}





