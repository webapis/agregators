

module.exports.nodeFetch = async function ({ host, path, method, headers, body, port, ssh = 'true' }) {
    const parsedPort = port && parseInt(port)
    const parseSsh = ssh ==='true'
   
    const https = parseSsh ? require('https') : require('http')
debugger;
    var options = {
        host,
        path,
        method: method ? method : 'GET',
        headers,
        port: parsedPort

    };

    const prom = new Promise((resolve, reject) => {
        var request = https.request(options, function (responce) {
            var body = ''
            responce.on("data", function (chunk) {
                body += chunk.toString('utf8')
            });
            responce.on("end", function () {
        
                
                return resolve(body)
            });
            responce.on("error", function (error) {
                console.log("Node fetch error", error);
                
                return reject(error)
            });
        });
        body && request.write(body)
        request.end();


    })

    return await prom
}