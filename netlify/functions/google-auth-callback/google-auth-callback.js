
const { exchangeGoogleAuthorizationCode, updateUsersWorkspaceGoogleAuthState } = require('../../../root/utils/oauth2/server/server.oauth2')
require('./test')
const client_id = process.env.client_id
const client_secret = process.env.CLIENT_SECRET
const redirect_uri = process.env.redirectUri
exports.handler = async (event, context) => {

    const { code, state } = event.queryStringParameters

debugger;   
    const  authdata = await exchangeGoogleAuthorizationCode({ client_id, client_secret, code, redirect_uri })
    

    debugger;
    await updateUsersWorkspaceGoogleAuthState({ ...authdata, state })
    const { access_token, refresh_token, scope } = authdata

    debugger;
   
    return {
        statusCode: 200, body: `<!DOCTYPE html>
      <html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Google Authentication</title>
     
        
      </head>

      <body>
      Google Authentication redirecting...
      <input type="hidden" id="access_token" value="${access_token}"/>
      <input type="hidden" id="refresh_token" value="${refresh_token}"/>
      <input type="hidden" id="scope" value="${scope}"/>
      <google-oauth-page></google-oauth-page>
      <script src="${process.env.host}/pages/google/google-oauth-page.js"></script>
      </body>

      </html>` }

}