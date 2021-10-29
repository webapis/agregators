

function getUrlParams(url) {

    // Parse query string to see if page request is coming from OAuth 2.0 server.
    var params = {};
    var regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(url)) {

        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);

    }

    return params
}


function initServer() {
    require('dotenv').config()
    const http = require('http');
    const path = require('path');
    const urlParser = require('url')
    const { exchangeCodeForAccessToken } = require('../utils/oauth2/server/server.oauth2')
    const dirPath = `${process.cwd()}/root/src/crawler/`;
    const port = process.env.PORT || 3000;
     const client_id = process.env.client_id
     const client_secret = process.env.client_secret
    const serveStatic = require('./serve-static')
    const { fetchGithubAuthCode, fetchGithubAccessToken, signInWithIdp } = require('../utils/github/index')

    const urlQuery = require('url');
    process.env.REDIRECT_URL = (process.env.SERVER === 'LOCAL_SERVER' || process.env.SERVER === 'LOCAL') ? process.env.DEV_REDIRECT_URL : process.env.PRODUCTION_REDIRECT_URL

    const server = http.createServer(async (req, res) => {
        const { url } = req

        res.statusCode = 200;
        switch (true) {

            case /login.html\?code=.*/.test(url):
                const { code: codeparam, state } = urlParser.parse(url, true).query
          
                res.uid = state
                ;
                const { access_token } = await fetchGithubAccessToken({ code: codeparam, client_id: process.env.gh_client_id, client_secret: process.env.gh_client_secret,res })
                await signInWithIdp({ access_token,filepath:dirPath + 'login.html',key:'AIzaSyDb8Z27Ut0WJ-RH7Exi454Bpit9lbARJeA',res })
                break;
            case /.*\/login.html\?authed=false/.test(url):
        
                fetchGithubAuthCode({ res, redirectUrl: 'http://localhost:3000/login.html', state: 'git_auth', client_id: process.env.gh_client_id })
                break;
   
            case /github-verification.html\?.*/.test(url):
             
                const uidparam = urlParser.parse(url, true).query.uid
                res.uid = uidparam
             
                fetchGithubAuthCode(res)
       
                break;

            case /tasks-configuration.html\?.*code=.*/.test(url):
                const redirectpath = dirPath + 'tasks-configuration.html'
               const responseQuery = urlParser.parse(url, true).query
                debugger;
                exchangeCodeForAccessToken({ client_id, client_secret, code: responseQuery.code, redirect_uri: process.env.REDIRECT_URL, res, filepath: redirectpath,state:responseQuery.state })
                break;
            case /.*local_workflow.*/.test(url):
                const projectName = urlQuery.parse(url, true).query.projectName
                const parameters = urlQuery.parse(url, true).query.parameters
             
                break;
            default:

                serveStatic(req, res)
        }
    })

    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = { initServer }

