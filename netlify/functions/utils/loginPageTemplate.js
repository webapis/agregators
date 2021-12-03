function template({  email, localId,photoUrl, screenName, idToken, refreshToken, expiresIn,token }) {
    debugger;
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
    <link href="https://workflow-runner.netlify.app/breadcrumb.css" rel="stylesheet">
</head>

<body>
   
    <div class="container mt-1">

        <div class="breadcrumb flat">
            <a href="/index.html" >Home</a>
        
            <a href="/login.html" class="active" id="ws-breadcrumb">Sign in</a>
            </div>
    </div>
<div class="container">
    
    <login-page class="row"></login-page>
</div>
<input type="hidden" id="token" value="${token}"/>
<input type="hidden" id="email" value="${email}"/>

<input type="hidden" id="localId" value="${localId}"/>

<input type="hidden" id="photoUrl" value="${photoUrl}"/>
<input type="hidden" id="screenName" value="${screenName}"/>
<input type="hidden" id="idToken" value="${idToken}"/>
<input type="hidden" id="refreshToken" value="${refreshToken}"/>
<input type="hidden" id="expiresIn" value="${expiresIn}"/>

    <script src="${process.env.host}/login-page.js"></script>
 
</body>

</html>`
}

module.exports = {
    template
}