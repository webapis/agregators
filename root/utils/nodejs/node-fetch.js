
const https = require('https');
module.exports.nodeFetch = async function ({ host, path, method, headers, body, port, ssh = true }) {
    const https = ssh ? require('https') : require('http')
    debugger;
    var options = {
        host,//: 'identitytoolkit.googleapis.com',
        path,//: encodeURI(`/v1/accounts:signInWithIdp?key=${key}`),
        method: method ? method : 'GET',
        headers,//: { 'Content-Type': 'application/json' },
        port

    };

    const prom = new Promise((resolve, reject) => {
        var request = https.request(options, function (responce) {
            var body = ''
            responce.on("data", function (chunk) {
                body += chunk.toString('utf8')
            });
            responce.on("end", function () {
                console.log("Body", body);
                debugger;
                return resolve(body)
            });
            responce.on("error", function (error) {
                console.log("Body", error);
                debugger;
                return reject(error)
            });
        });
        body && request.write(body)
        request.end();


    })

    return await prom
}