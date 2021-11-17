require('dotenv').config()


//const {gh_client_id,gh_redirectUrl,state}=config

exports.handler = async function(event, context) {
    // your server-side functionality
 //   const authorizationURI = await fetchGithubAuthCode()
 
 console.log('gh_client_id....',process.env.gh_client_id)
return  {
  statusCode: 302,
  headers: {
    Location:  encodeURI(`https://github.com/login/oauth/authorize?client_id=${process.env.gh_client_id}&redirect_uri=${process.env.redirectUrl}&scope=repo public_repo workflow user&state='test_state'&allow_signup=true`),
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