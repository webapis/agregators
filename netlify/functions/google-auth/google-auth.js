
require('dotenv').config()

exports.handler = async function(event, context) {
  const {scope,state,redirect_url,client_id} =event.queryStringParameters
    const authRequestUri = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&access_type=offline&include_granted_scopes=true&response_type=code&state=${state}&redirect_uri=${redirect_url}&client_id=${client_id}`
    debugger;
return  {
  statusCode: 302,
  headers: {
    Location:  encodeURI(authRequestUri),
    'Cache-Control': 'no-cache' // Disable caching of this response
  },
  body:''
}
// return {
//     statusCode: 200,
//     body:JSON.stringify(event)
// }

}

