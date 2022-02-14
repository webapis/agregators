require('dotenv').config()

exports.handler = async function (event, context) {
 
  debugger;
  return {
    statusCode: 302,
    headers: {
      Location: encodeURI(`https://github.com/login/oauth/authorize?client_id=${process.env.gh_client_id}&redirect_uri=${process.env.redirectUrl}&scope=repo public_repo workflow user&state=test_state&allow_signup=true`),
      'Cache-Control': 'no-cache' // Disable caching of this response
    },
    body: ''
  }
}

