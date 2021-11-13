const config =require('./utils/oauth')
 const {fetchGithubAuthCode}=require('../../../root/utils/github')
//const {gh_client_id,gh_redirectUrl,state}=config

exports.handler = async function(event, context) {
    // your server-side functionality
    const authorizationURI = await fetchGithubAuthCode()
console.log('authorizationURI....',authorizationURI)
return  {
  statusCode: 302,
  headers: {
    Location: authorizationURI,
    'Cache-Control': 'no-cache' // Disable caching of this response
  },
  body:''
}


}

/*
    return  {
        statusCode: 302,
        headers: {
          Location: authorizationURI,
          'Cache-Control': 'no-cache' // Disable caching of this response
        },
        body: '' // return body for local dev
      }
*/