const config =require('./utils/oauth')
const {gh_client_id,gh_redirectUrl,state}=config
exports.handler = async function(event, context) {
    // your server-side functionality
    const authorizationURI = `https://github.com/login/oauth/authorize?client_id=${gh_client_id}&redirect_uri=${gh_redirectUrl}&scope=repo public_repo workflow user&state=${state}&allow_signup=true`
    return  {
        statusCode: 302,
        headers: {
          Location: authorizationURI,
          'Cache-Control': 'no-cache' // Disable caching of this response
        },
        body: '' // return body for local dev
      }
}