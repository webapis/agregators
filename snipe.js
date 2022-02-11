const { exec } = require('child_process');

const {githubHttpsRequestsMock}=require('./features/support/mocks/server-https-mock/github-https-mock')

githubHttpsRequestsMock()


exec('netlify dev', (error, stdout, stderr) => {
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
  if (error !== null) {
    console.log(`exec error: ${error}`);
  }
});

