var YOUR_CLIENT_ID = '117708549296-uij0mup1c3biok6ifaupa2951vtvf418.apps.googleusercontent.com';
var YOUR_REDIRECT_URI = 'http://localhost:3000/oauth2callback';
var fragmentString = location.hash.substring(1);

// Parse query string to see if page request is coming from OAuth 2.0 server.
var params = {};
var regex = /([^&=]+)=([^&]*)/g, m;
while (m = regex.exec(fragmentString)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    
}
if (Object.keys(params).length > 0) {
    localStorage.setItem('oauth2-test-params', JSON.stringify(params));
    if (params['state'] && params['state'] == 'try_sample_request') {
        callGoogleAPI({client_id:YOUR_CLIENT_ID,redirect_uri:YOUR_REDIRECT_URI,scope='https://www.googleapis.com/auth/drive.metadata.readonly', state='try_sample_request'});
    }
}

// If there's an access token, try an API request.
// Otherwise, start OAuth 2.0 flow.
function callGoogleAPI({requestParams}) {
    var params = JSON.parse(localStorage.getItem('oauth2-test-params'));
    if (params && params['access_token']) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET',
            'https://www.googleapis.com/drive/v3/about?fields=user&' +
            'access_token=' + params['access_token']);
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.response);
                debugger;
            } else if (xhr.readyState === 4 && xhr.status === 401) {
                // Token invalid, so prompt for user permission.
                authorizationRequest(requestParams)
            }
        };
        xhr.send(null);
    } else {
        authorizationRequest(requestParams)
    }
}


function authorizationRequest({ client_id, redirect_uri, scope, state, include_granted_scopes = true, response_type = 'code', access_type = 'offline' }) {
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create element to open OAuth 2.0 endpoint in new window.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'scope': scope,// 'https://www.googleapis.com/auth/drive.metadata.readonly',
        'state': state,//'try_sample_request',
        'include_granted_scopes': include_granted_scopes,//'true',
        'response_type': response_type,// 'code'
        'access_type': access_type
    };

    // Add form parameters as hidden input values.
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}











/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
// function oauth2SignIn({ }) {
//     // Google's OAuth 2.0 endpoint for requesting an access token
//     var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

//     // Create element to open OAuth 2.0 endpoint in new window.
//     var form = document.createElement('form');
//     form.setAttribute('method', 'GET'); // Send as a GET request.
//     form.setAttribute('action', oauth2Endpoint);

//     // Parameters to pass to OAuth 2.0 endpoint.
//     var params = {
//         'client_id': YOUR_CLIENT_ID,
//         'redirect_uri': YOUR_REDIRECT_URI,
//         'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
//         'state': 'try_sample_request',
//         'include_granted_scopes': 'true',
//         'response_type': 'code'
//     };

//     // Add form parameters as hidden input values.
//     for (var p in params) {
//         var input = document.createElement('input');
//         input.setAttribute('type', 'hidden');
//         input.setAttribute('name', p);
//         input.setAttribute('value', params[p]);
//         form.appendChild(input);
//     }

//     // Add form to page and submit it to open the OAuth 2.0 endpoint.
//     document.body.appendChild(form);
//     form.submit();
// }
