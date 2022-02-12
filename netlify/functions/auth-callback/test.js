require('dotenv').config()
const nock = require('nock')
console.log('process.env.BDD_TEST', process.env.BDD_TEST)
if (process.env.BDD_TEST === 'TRUE') {
  const scope1 = nock('https://github.com')
    .persist()
    .post(uri => uri.includes('/login/oauth/access_token?client_id='))
    .replyWithFile(200, `${process.cwd()}/mock-data/git-repos/tokenResponse.json`, {
      'Content-Type': 'application/json',
    })
  const scope2 = nock('https://identitytoolkit.googleapis.com')
    .persist()
    .post(uri => uri.includes('/v1/accounts:signInWithIdp?key='))
    .replyWithFile(200, `${process.cwd()}/mock-data/firebase-oauth/tokenResponse.json`, {
      'Content-Type': 'application/json',
    })

}


