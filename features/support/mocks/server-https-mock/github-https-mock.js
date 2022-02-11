const nock =require('nock')


 
  function githubHttpsRequestsMock(){
    nock('https://github.com')
    .post(uri => uri.includes('/login/oauth/access_token?client_id='))
    .replyWithFile(200, `${process.cwd()}/mock-data/git-repos/tokenResponse.json`, {
      'Content-Type': 'application/json',
    })
  }

  module.exports={githubHttpsRequestsMock}