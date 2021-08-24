const http = require('http');
const path = require('path');
const fs = require('fs');
const urlParser=require('url')
const { exchangeCodeForAccessToken } = require('./utils/oauth2/server/server.oauth2')
const dirPath = path.join(__dirname, `/src/${process.env.app}/`);
const filepath = dirPath + 'index.html'
const port = process.env.PORT || 3000;
const client_id = '117708549296-uij0mup1c3biok6ifaupa2951vtvf418.apps.googleusercontent.com'
const client_secret = process.env.client_secret
const redirect_uri = 'http://localhost:3000/oauth2callback'
const serveStatic = require('./server/serve-static')
const { fetchDeviceAndUserVerificationCode,fetchGithubAuthCode,fetchGithubAccessToken } = require('./utils/github')
const server = http.createServer((req, res) => {
    const { url } = req
    
    res.statusCode = 200;
    switch (true) {
        case /.*\/oauth2callback$/.test(url):
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(filepath).pipe(res)
            break;
        case /.*\/oauth2callback?.*/.test(url):
            const { code } = getUrlParams(url)
            exchangeCodeForAccessToken({ client_id, client_secret, code, redirect_uri, res })
            break;
        case /.*\/user-settings.html\?state=.*/.test(url):
            const redirectpath = dirPath + 'user-settings.html'
            exchangeCodeForAccessToken({ client_id, client_secret, code: getUrlParams(url).code, redirect_uri: `http://localhost:3000/user-settings.html`, res, filepath: redirectpath })
            break;
        case /github-verification.html\?.*/.test(url):
            const uidparam =urlParser.parse(url,true).query.uid
            res.uid=uidparam
            debugger;
            fetchGithubAuthCode(res)
            debugger;
            break;
            case /user-settings.html\?code=.*/.test(url):
                const {code:codeparam,state} =urlParser.parse(url,true).query
                res.uid=state
        debugger;
            fetchGithubAccessToken(codeparam,res)
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





