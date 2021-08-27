process.env.SERVER = 'LOCAL_SERVER'
require('dotenv').config()
const fetch = require('node-fetch')
//const { firebaseApp, fbDatabase } = require('./utils/firebase/firebaseInit')
const { fbRest } = require('./utils/firebase/firebase-rest')
debugger;
function refreshCustomToken() {

    fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.api_key}`, { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: process.env.custom_token, returnSecureToken: true }) }).then(result => {

        debugger;
        return result.json()
    }).then(data => {
        debugger;
    })

        .catch(error => {
            debugger;
        })
}


function customAuth() {
    const auth = firebaseApp.auth()
    auth.signInWithCustomToken(process.env.custom_token).then(credentials => {
        debugger;
    }).catch(error => {
        debugger;
    })
    debugger

}

function renewIdToken() {
    fetch(`https://securetoken.googleapis.com/v1/token?key=${process.env.api_key}`, { method: 'post', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=refresh_token&refresh_token=${process.env.refresh_token}` }).then(response => {

        debugger;
        return response.json()
    }).then(data => {
        const { id_token } = data
        debugger;
        fbRest().setIdToken(id_token).setProjectUri('https://turkmenistan-market.firebaseio.com').ref('rest').set({ greeting: 'hello friend' }, () => {
            debugger;
        })

    }).catch(error => {
        debugger;
    })
}
//customAuth()

//refreshCustomToken()
//renewIdToken()


// fbRest().setIdToken(process.env.idToken).setProjectUri('https://turkmenistan-market.firebaseio.com').ref('rest').set({ googby: 'good expiration....' }, (error ) => {
//     if (error) {
//         debugger;
//     }
//     debugger;
// })


const fbDatabase = fbRest().setIdToken(process.env.idToken).setProjectUri('https://turkmenistan-market.firebaseio.com').ref('users').orderByChild('email').equalTo('tkm.house.new@gmail.com').limitToLast(1)

fbDatabase.once(({ data, error }) => {
  //  const accesstoken = Object.entries(data).map((m) => { return { val: () => m[1], key: m[0] } })



    debugger;
})