
const https = require('http');
module.exports.nodeFetch=async function ({ host, path, method, headers, body }) {

    var options = {
        host,//: 'identitytoolkit.googleapis.com',
        path,//: encodeURI(`/v1/accounts:signInWithIdp?key=${key}`),
        method: method ? method : 'GET',
        headers//: { 'Content-Type': 'application/json' },

    };
 
    const prom = new Promise((resolve, reject) => {
        var request = https.request(options, function (responce) {
            var body = ''
            responce.on("data", function (chunk) {
                body += chunk.toString('utf8')
            });
            responce.on("end", function () {
                console.log("Body", body);

                return resolve(body)
            });
            responce.on("error", function (error) {
                console.log("Body", error);

                return reject(error)
            });
        });
        body && request.write(body)
        request.end();


    })

    return await prom
}