// const config = require('./utils/oauth')
// const {gh_client_secret,gh_client_id}=config
 const {fetchGithubAccessToken,authWithFirebase,userIsNew}=require('../../../root/utils/github')
exports.handler = async(event, context) => {

     const code = event.queryStringParameters.code
    // /* state helps mitigate CSRF attacks & Restore the previous state of your app */
    // const state = event.queryStringParameters.state
     const response = await fetchGithubAccessToken({ code: code, client_id: process.env.gh_client_id, client_secret: process.env.gh_client_secret })
    const {access_token} = JSON.parse(response)
    const firebaseauthResponse = await authWithFirebase({access_token,key:'AIzaSyDb8Z27Ut0WJ-RH7Exi454Bpit9lbARJeA'})
    const firebaseAuthData =JSON.parse(firebaseauthResponse)
    await userIsNew(...firebaseAuthData)
    console.log('firebaseauthResponse.....',firebaseAuthData)
 
   //  await signInWithIdp({ access_token,filepath:dirPath + 'login.html',key:'AIzaSyDb8Z27Ut0WJ-RH7Exi454Bpit9lbARJeA',res })
  return {statusCode:200, body:JSON.stringify({greet:"hello ouath2",access_token,firebaseAuthData})}

}