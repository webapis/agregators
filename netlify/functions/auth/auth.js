require('dotenv').config()


//const {gh_client_id,gh_redirectUrl,state}=config

exports.handler = async function (event, context) {
  // your server-side functionality

  if (process.env.BDD_TEST === 'TRUE') {
    const firebaseAuthData = require('../../../mock-data/firebaseAuthData.json')
    const {template} = require('../utils/loginPageTemplate')
    return {
      statusCode: 200, body: template(firebaseAuthData)
    }

  } else {

    console.log('gh_client_id....', process.env.gh_client_id)
    return {
      statusCode: 302,
      headers: {
        Location: encodeURI(`https://github.com/login/oauth/authorize?client_id=${process.env.gh_client_id}&redirect_uri=${process.env.redirectUrl}&scope=repo public_repo workflow user&state='test_state'&allow_signup=true`),
        'Cache-Control': 'no-cache' // Disable caching of this response
      },
      body: ''
    }

  }



}

