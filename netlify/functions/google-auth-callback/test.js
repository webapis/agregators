require('dotenv').config()
const nock = require('nock')
console.log('process.env.BDD_TEST', process.env.BDD_TEST)
if (process.env.BDD_TEST === 'TRUE') {
  const scope1 = nock('https://oauth2.googleapis.com')
    .persist()
    .post(uri => uri.includes('/token?client_id='))
    .replyWithFile(200, `${process.cwd()}/mock-data/google/accessToken.json`, {
      'Content-Type': 'application/json',
    })


}


