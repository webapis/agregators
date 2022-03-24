require('dotenv').config()
const { nodeFetch } = require('../../../root/utils/nodejs/node-fetch')
const client_id = process.env.client_id
console.log('client_id',client_id)
const client_secret = process.env.CLIENT_SECRET
console.log('client_secret',client_secret)
exports.handler = async function (event, context) {
    const { refresh_token } = event.queryStringParameters
    console.log('refresh_token',refresh_token)
    debugger;
    const response = await nodeFetch({ host: 'oauth2.googleapis.com', path: `/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=refresh_token&refresh_token=${refresh_token}`, method: 'post', headers: { 'User-Agent': 'node.js', 'Content-Type': 'application/json' } })
   debugger;
    return {
        statusCode: 200, body: response
    }
}

