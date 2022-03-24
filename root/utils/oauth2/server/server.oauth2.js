
const { nodeFetch } = require('../../nodejs/node-fetch')

async function exchangeGoogleAuthorizationCode({ client_id, client_secret, code, redirect_uri }) {
    // Exchange google authorization code for access token
    debugger;
    const grant_type = 'authorization_code';
    var path = `/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=${grant_type}&redirect_uri=${redirect_uri}`
    const response = await nodeFetch({ host: 'oauth2.googleapis.com', path, method: 'post' })
    debugger;
    const authData = JSON.parse(response)
    console.log('authData', authData)
    debugger;

    return authData

}


async function updateUsersWorkspaceGoogleAuthState({ access_token, refresh_token, scope, state }) {

    const update = { google: { access_token, refresh_token, scope } }
    const params = state.split('--xxx--')
    const selectedWorkspace = params[0]
    const uid = params[1]
    const idToken = params[2]

    const host = process.env.databaseHost
    const path = `/oauth/users/${uid}/workspaces/${selectedWorkspace}/auth.json?auth=${idToken}`
    console.log('selectedWorkspace', selectedWorkspace)
    console.log('uid', uid)
    console.log('idToken', idToken)
    console.log('host', host)
  
    const port = process.env.dbPort ? parseInt(process.env.dbPort) : undefined
    
    console.log('port', port)

    const ssh = process.env.dbSsh === 'true'
    debugger;
    const response = await nodeFetch({ host, path, method: 'PUT', body: JSON.stringify(update), port, ssh })
    //   const data = JSON.parse(response)
    console.log('response', response)
    return {}



}


async function getUserEmail({ token }) {
    try {

        const oauthendpoint = 'https://www.googleapis.com/userinfo/v2/me'
        const response = await fetch(oauthendpoint, { headers: { 'Authorization': `Bearer ${token}`, method: 'get' } })

        const data = await response.json()
        debugger;
        return data

    } catch (error) {
        debugger;
        console.log('error', error)
    }

}


module.exports = { exchangeGoogleAuthorizationCode, updateUsersWorkspaceGoogleAuthState }





