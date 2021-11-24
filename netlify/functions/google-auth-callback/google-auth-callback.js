
exports.handler = async (event, context) => {

    return {
        statusCode: 200,
        body: JSON.stringify(event)
    }

    return {
        statusCode: 200, body: `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Home</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"
      integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
      <link href="https://workflow-runner.netlify.app/ws-dashboard/breadcrumb.css" rel="stylesheet">
  </head>
  
  <body>
  
   
  </body>
  
  </html>` }

}