const fetch = require(`${process.cwd()}/node_modules/node-fetch/lib/index.js`)
const jsdom = require("jsdom");
const { URL } = require('url')
const { JSDOM } = jsdom;

const { fbRest } = require('../firebase/firebase-rest')



async function fetchGithubAuthCode({ res, redirectUrl, state, client_id }) {
    const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirectUrl}&scope=repo public_repo workflow user&state=${state}&allow_signup=true`

    res.writeHead(302, { 'Location': url });
    res.end();
}

async function fetchGithubAccessToken({ code, client_id, client_secret, res, req }) {

    const response = await fetch(`https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`, { method: 'post', headers: { 'Accept': 'application/json' } })

    const data  = await response.json()
    return data
}



async function signInWithIdp({ access_token, filepath, key, res }) {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${key}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postBody: `access_token=${access_token}&providerId=github.com`, requestUri: "https://turkmenistan-market.firebaseapp.com/__/auth/handler", returnIdpCredential: true, returnSecureToken: true }) })

    const data = await response.json()

    const { email, emailVerified, federatedId, kind, localId, needConfirmation, oauthAccessToken, photoUrl, providerId, screenName,refreshToken,idToken, expiresIn }=data
    debugger;
    const publicData ={email,photoUrl}
    const privateData={token:oauthAccessToken,refreshToken,idToken,screenName,email}
    const fbDatabase = fbRest().setIdToken(idToken).setProjectUri(process.env.databaseURL)

    fbDatabase.ref(`users/private/${localId}/fb_auth`).once('value',async(error,response)=>{
        
        if(!response){
            await fetch(`https://api.github.com/repos/webapis/workflow_runner/forks`, { method: 'post', headers: { 'Authorization': `token ${access_token}`, 'Accept': 'application/vnd.github.v3+json' } })
       
            await responseHandler({fbDatabase,publicData,privateData,filepath,emailVerified,federatedId,kind,needConfirmation,providerId,localId,email,oauthAccessToken,refreshToken,idToken,screenName,photoUrl,res,expiresIn})
        
        } else{
            const fetchPath = `https://api.github.com/repos/${screenName}/workflow_runner/merge-upstream`

          const response=  await fetch(fetchPath, {
                method: 'post',
                headers: {
                    authorization: `token ${access_token}`,
                    Accept: 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({ branch: 'main' })
            })

            const resData =await response.json()
            
            await responseHandler({fbDatabase,publicData,privateData,filepath,emailVerified,federatedId,kind,needConfirmation,providerId,localId,email,oauthAccessToken,refreshToken,idToken,screenName,photoUrl,res,expiresIn})

        }




    })
  


    }

async function responseHandler({fbDatabase,privateData,publicData,filepath,emailVerified,federatedId,kind,needConfirmation,providerId,localId,email,oauthAccessToken,refreshToken,idToken,screenName,photoUrl,res,expiresIn}){
    fbDatabase.ref(`users`).update({[`private/${localId}/fb_auth`]:privateData,[`public/users/${screenName}`]:publicData},async (error, data) => {
        const dom = await JSDOM.fromFile(filepath)
        const document = dom.window.document;
    
        var emailInput = document.createElement('input');
        emailInput.setAttribute('type', 'hidden');
        emailInput.setAttribute('id', 'email');
        emailInput.setAttribute('value', email);
        document.body.appendChild(emailInput);
    
        var emailVerifiedInput = document.createElement('input');
        emailVerifiedInput.setAttribute('type', 'hidden');
        emailVerifiedInput.setAttribute('id', 'emailVerified');
        emailVerifiedInput.setAttribute('value', emailVerified);
        document.body.appendChild(emailVerifiedInput);
    
        var federatedIdInput = document.createElement('input');
        federatedIdInput.setAttribute('type', 'hidden');
        federatedIdInput.setAttribute('id', 'federatedId');
        federatedIdInput.setAttribute('value', federatedId);
        document.body.appendChild(federatedIdInput);
    
        var kindInput = document.createElement('input');
        kindInput.setAttribute('type', 'hidden');
        kindInput.setAttribute('id', 'kind');
        kindInput.setAttribute('value', kind);
        document.body.appendChild(kindInput);
    
    
        var localIdInput = document.createElement('input');
        localIdInput.setAttribute('type', 'hidden');
        localIdInput.setAttribute('id', 'localId');
        localIdInput.setAttribute('value', localId);
        document.body.appendChild(localIdInput);
    
    
        var needConfirmationInput = document.createElement('input');
        needConfirmationInput.setAttribute('type', 'hidden');
        needConfirmationInput.setAttribute('id', 'needConfirmation');
        needConfirmationInput.setAttribute('value', needConfirmation);
        document.body.appendChild(needConfirmationInput);
    
    
        var oauthAccessTokenInput = document.createElement('input');
        oauthAccessTokenInput.setAttribute('type', 'hidden');
        oauthAccessTokenInput.setAttribute('id', 'oauthAccessToken');
        oauthAccessTokenInput.setAttribute('value', oauthAccessToken);
        document.body.appendChild(oauthAccessTokenInput);
    
    
        var photoUrlInput = document.createElement('input');
        photoUrlInput.setAttribute('type', 'hidden');
        photoUrlInput.setAttribute('id', 'photoUrl');
        photoUrlInput.setAttribute('value', photoUrl);
        document.body.appendChild(photoUrlInput);
    
        var providerIdInput = document.createElement('input');
        providerIdInput.setAttribute('type', 'hidden');
        providerIdInput.setAttribute('id', 'providerId');
        providerIdInput.setAttribute('value', providerId);
        document.body.appendChild(providerIdInput);
    
    
    
        var screenNameInput = document.createElement('input');
        screenNameInput.setAttribute('type', 'hidden');
        screenNameInput.setAttribute('id', 'screenName');
        screenNameInput.setAttribute('value', screenName);
        document.body.appendChild(screenNameInput);
    
        var idTokenInput = document.createElement('input');
        idTokenInput.setAttribute('type', 'hidden');
        idTokenInput.setAttribute('id', 'idToken');
        idTokenInput.setAttribute('value', idToken);
        document.body.appendChild(idTokenInput);
    
        var refreshTokenInput = document.createElement('input');
        refreshTokenInput.setAttribute('type', 'hidden');
        refreshTokenInput.setAttribute('id', 'refreshToken');
        refreshTokenInput.setAttribute('value', refreshToken);
        document.body.appendChild(refreshTokenInput);
    
        var expiresInInput = document.createElement('input');
        expiresInInput.setAttribute('type', 'hidden');
        expiresInInput.setAttribute('id', 'expiresIn');
        expiresInInput.setAttribute('value', expiresIn);
        document.body.appendChild(expiresInInput);

        const content = dom.serialize()
        
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Length', Buffer.byteLength(content));
           res.write(content)
           res.end()
        
    
    })

}
module.exports = { fetchGithubAuthCode, fetchGithubAccessToken, signInWithIdp }



