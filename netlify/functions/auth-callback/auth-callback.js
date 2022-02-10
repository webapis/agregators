
const { fetchGithubAccessToken, authWithFirebase, updateUserCredentials } = require('../../../root/utils/github')
exports.handler = async (event, context) => {
    const { template } = require('../utils/loginPageTemplate')
    const { code, state } = event.queryStringParameters
    const client_secret = process.env.GH_CLIENT_SECRET
    let githubResponse = null;
    let firebaseauthResponse = null;
    debugger;
    if (state === undefined) {
        debugger;
        githubResponse = require(`${process.cwd()}/mock-data/git-repos/tokenResponse.json`)
        debugger;
    } else {
        githubResponse = await fetchGithubAccessToken({ code: code, client_id: process.env.gh_client_id, client_secret })
    }
    debugger;
    const { access_token } = JSON.parse(githubResponse)
    if(state === undefined){
        firebaseauthResponse = require(`${process.cwd()}/mock-data/firebase-oauth/tokenResponse.json`)
    }else{
        firebaseauthResponse = await authWithFirebase({ access_token, key: process.env.webapikey })
        debugger;
    }

    const firebaseAuthData = JSON.parse(firebaseauthResponse)
    await updateUserCredentials(firebaseAuthData)
    return {
        statusCode: 200, body: template({ ...firebaseAuthData, token: access_token })
    }

}




