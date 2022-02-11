require('dotenv').config()
const nock =require('nock')
console.log('process.env.BDD_TEST',process.env.BDD_TEST)
if(process.env.BDD_TEST==='TRUE'){
    nock('https://github.com')
    .post(uri => uri.includes('/login/oauth/access_token?client_id='))
    .replyWithFile(200, `${process.cwd()}/mock-data/git-repos/tokenResponse.json`, {
      'Content-Type': 'application/json',
    })
}
 
  
