// const config = require('./utils/oauth')
// const {gh_client_secret,gh_client_id}=config
// const {signInWithIdp,fetchGithubAccessToken}=require('../../../root/utils/github')
exports.handler = async(event, context) => {

    // const code = event.queryStringParameters.code
    // /* state helps mitigate CSRF attacks & Restore the previous state of your app */
    // const state = event.queryStringParameters.state
    // const { access_token } = await fetchGithubAccessToken({ code: code, client_id: gh_client_id, client_secret: gh_client_secret })

    // await signInWithIdp({ access_token,filepath:dirPath + 'login.html',key:'AIzaSyDb8Z27Ut0WJ-RH7Exi454Bpit9lbARJeA',res })
  return {statusCode:200, body:JSON.stringify({greet:"hello ouath2"})}

}