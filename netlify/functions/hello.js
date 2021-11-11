

exports.handler = async function(event, context) {
    // your server-side functionality

    return  {
        statusCode: 200,
     
        body: JSON.stringify({hello:'hi'}) // return body for local dev
      }
}