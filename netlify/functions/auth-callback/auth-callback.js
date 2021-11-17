// const config = require('./utils/oauth')

// const {gh_client_secret,gh_client_id}=config
const { fetchGithubAccessToken, authWithFirebase, updateUserCredentials } = require('../../../root/utils/github')
exports.handler = async (event, context) => {
    console.log('gh_client_id....2',process.env.gh_client_id)
  const code = event.queryStringParameters.code
  // /* state helps mitigate CSRF attacks & Restore the previous state of your app */
  // const state = event.queryStringParameters.state
  const response = await fetchGithubAccessToken({ code: code, client_id: process.env.gh_client_id, client_secret: process.env.gh_client_secret })
  const { access_token } = JSON.parse(response)
  console.log('access_token____',access_token)
  const firebaseauthResponse = await authWithFirebase({ access_token, key: 'AIzaSyDb8Z27Ut0WJ-RH7Exi454Bpit9lbARJeA' })
  console.log('firebaseauthResponse____!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',firebaseauthResponse)
  const firebaseAuthData = JSON.parse(firebaseauthResponse)
  const { localId, idToken, screenName, federatedId, email, emailVerified, kind, needConfirmation, providerId, oauthAccessToken, photoUrl, refreshToken, expiresIn } = firebaseAuthData
console.log('firebaseAuthData',firebaseAuthData)
   await updateUserCredentials(firebaseAuthData)

  return {
    statusCode: 200, body: `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Home</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"
      integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
      <link href="https://workflow-runner.netlify.app/ws-dashboard/breadcrumb.css" rel="stylesheet">
  </head>
  
  <body>
     
      <div class="container mt-1">
  
          <div class="breadcrumb flat">
              <a href="/index.html" >Home</a>
          
              <a href="/login.html" class="active" id="ws-breadcrumb">Sign in</a>
              </div>
      </div>
  <div class="container">
      
      <login-page class="row"></login-page>
  </div>
  <input type="hidden" id="federatedId" value="${federatedId}"/>
  <input type="hidden" id="email" value="${email}"/>
  <input type="hidden" id="emailVerified" value="${emailVerified}"/>
  <input type="hidden" id="kind" value="${kind}"/>
  <input type="hidden" id="localId" value="${localId}"/>
  <input type="hidden" id="needConfirmation" value="${needConfirmation}"/>
  <input type="hidden" id="oauthAccessToken" value="${oauthAccessToken}"/>
  <input type="hidden" id="photoUrl" value="${photoUrl}"/>
  <input type="hidden" id="providerId" value="${providerId}"/>
  <input type="hidden" id="screenName" value="${screenName}"/>
  <input type="hidden" id="idToken" value="${idToken}"/>
  <input type="hidden" id="refreshToken" value="${refreshToken}"/>
  <input type="hidden" id="expiresIn" value="${expiresIn}"/>

      <script src="${process.env.host}/login-page.js"></script>
   
  </body>
  
  </html>` }

}