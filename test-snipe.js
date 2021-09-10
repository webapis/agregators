var request = require('sync-request')

var res = request("POST","https://api.github.com/repos/serdartkm/actor-prj/contents/README.md", { headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${process.env.gitticket}`, } });


debugger;
module.exports = res.getBody()