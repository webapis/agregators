process.env.SERVER = 'LOCAL_SERVER'
require('dotenv').config()
const fetch = require('node-fetch')
//const { firebaseApp, fbDatabase } = require('./utils/firebase/firebaseInit')
const { fbRest } = require('./utils/firebase/firebase-rest')
const { StringDecoder } = require('string_decoder')

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
    fetch(`https://securetoken.googleapis.com/v1/token?key=${process.env.api_key}`, { method: 'post', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=refresh_token&refresh_token=${process.env.fb_refresh_token}` }).then(response => {

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


// const fbDatabase = fbRest().setIdToken(process.env.idToken).setProjectUri('https://turkmenistan-market.firebaseio.com').ref('projects/books')

// fbDatabase.on('value',(error,e)=>{
//     const {data,path}=JSON.parse(e.data)
//     if(path!=='/'){
//         debugger;
//     }
//     debugger;
// })
// var clone = require('git-clone');

// clone('https://github.com/serdartkm/actor-prj.git',`${process.cwd()}/cloned-repo`,{},function(data){
//     debugger;
// })
const fs = require('fs')
const rootpath = 'https://api.github.com/repos/serdartkm/actor-prj/contents/'
const files = []
// fetch(`${rootpath}main.js`, { headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${process.env.gitticket}`, } }).then(response => response.json()).then(data => {
//     const { content } = data

//     const fileContents = Buffer.from(content, 'base64')
//     const humanreadable = fileContents.toString()
//     const foundReferences = humanreadable.match(/require\(("|')[.]\/.*("|')\)/g).map(m => m.replace('require(\'', '').replace('\')', '').replace('.','').concat('.js') )
//     files.push(...foundReferences)
//     debugger;
//     fs.writeFile(`${process.cwd()}/cloned-repo/main.js`, fileContents, (err) => {
//         debugger;
//         if (err) return console.error(err)

//     })

//     debugger;
// }).catch(error => {
//     debugger;
// })
//sha actor-prj master
//e7dbb4d44ee9b603f62875f0cce9b52fd472afb6
// fetch(`https://api.github.com/repos/serdartkm/actor-prj/branches`).then(response => response.json()).then(data => { 

// debugger; 


// }).catch(error => {

//     debugger;
// })


// ----GET FILE TREE FROM WORK REPOSITORY (REQUIRED TO UPLOAD TO NEW PROJECT BRANCH WHI)
// fetch(`https://api.github.com/repos/serdartkm/actor-prj/git/trees/e7dbb4d44ee9b603f62875f0cce9b52fd472afb6`).then(response => response.json()).then(data => { 

//     debugger; 


//     }).catch(error => {

//         debugger;
//     })



//----CREATE A NEW BRANCH
// fetch(`https://api.github.com/repos/serdartkm/actor-prj/git/refs`, { method: 'post', headers: { Accept: "application/vnd.github.v3+json", authorization: `token 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` }, body: JSON.stringify({ sha: "e7dbb4d44ee9b603f62875f0cce9b52fd472afb6", ref:'refs/heads/books' }) }).then(response => response.json()).then(data => {

//     debugger;

// }).catch(error => {

//     debugger;
// })


//--- UPLOAD CONTENT TO NEW BRANCH (PROJECT RELATED BRANCH)
//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
const bs64string = Buffer.from("Hello World").toString('base64')
// debugger;
fetch(`https://api.github.com/repos/serdartkm/actor-prj/contents/firstcontent.txt`, { method: 'put', headers: { Accept: "application/vnd.github.v3+json", authorization: `token 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` }, body: JSON.stringify({ message: "first content", content: bs64string, branch:'books' }) }).then(response => response.json()).then(data => {

    debugger;

}).catch(error => {

    debugger;
})
