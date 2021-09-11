

async function googleAuth({ navAfterAuth }) {
    var provider = new firebase.auth.GithubAuthProvider();

    provider.addScope('repo workflow user');
    provider.setCustomParameters({
        'allow_signup': 'false'
      });   
debugger;
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
            var { additionalUserInfo: { isNewUser } } = result
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;

            // The signed-in user info.
            var user = result.user;
            const fb_refresh_token = user.refreshToken
            debugger;
            if (isNewUser) {
                firebase.database().ref(`users/${user.uid}`).set({ email: user.email, role: 'standard', fb_refresh_token: user.refreshToken }, async (error) => {
                    if (error) {
                        window.pageStore.dispatch({
                            type: window.actionTypes.ERROR,
                            payload: error
                        });
                    } else {
                        fetch(`https://api.github.com/repos/webapis/agregators/forks`, { method: 'post', headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' } }).then(response => {
                            debugger;
                            return response.json()
                        }).then(data => {
                            debugger;
                            const { owner: { login } } = data
                            const userRef = firebase.database().ref(`users/${user.uid}`)
                            userRef.update({ ghuser: login, gh_action_url: `https://api.github.com/repos/${login}/agregators/actions/workflows/aggregate.yml/dispatches` }, (error) => {
                                if (error) {
                                    console.log(error)
                                } else {
                                    debugger;
                                    window.pageStore.dispatch({
                                        type: window.actionTypes.AUTH_SUCCESS,
                                        payload: { auth: { user, token, role: 'standard', fb_refresh_token }, navAfterAuth }
                                    });
                                    window.location.replace(navAfterAuth);
                                }
                            })
                        })
                    }
                })
            } else {
                firebase.database().ref(`users/${user.uid}`).on('value', snap => {
                    const role = snap.val()['role']
                    const gh_tkn = snap.val()['ghtoken'] ? snap.val()['ghtoken'] : null;
                    const gh_user = snap.val()['ghuser'] ? snap.val()['ghuser'] : null;
                    if (gh_tkn) {
                        const fetchPath = `https://api.github.com/repos/${gh_user}/agregators/merge-upstream`
                        console.log('fetchPath', fetchPath)
                        fetch(fetchPath, {
                            method: 'post',
                            headers: {
                                authorization: `token ${gh_tkn}`,
                                Accept: 'application/vnd.github.v3+json'
                            },
                            body: JSON.stringify({ branch: 'action' })
                        }).then(result => {

                            return result.json()
                        }).then(data => {
                            console.log('data upstream', data)
                            debugger;
                            window.pageStore.dispatch({
                                type: window.actionTypes.AUTH_SUCCESS,
                                payload: { auth: { user, token, role, fb_refresh_token, gh_tkn, gh_user }, navAfterAuth }
                            });
                            window.location.replace(navAfterAuth);
                        }).catch(error => {
                            console.log('error', error)
                        })
                    }

                })

            }



            return result
            // ...
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;

            // ...
            return error
        });


}
var YOUR_CLIENT_ID = '117708549296-uij0mup1c3biok6ifaupa2951vtvf418.apps.googleusercontent.com';
var YOUR_REDIRECT_URI = 'http://localhost:3000/project-dashboard.html';
var fragmentString = location.href

// Parse query string to see if page request is coming from OAuth 2.0 server.
var params = {};

var regex = /([^&=]+)=([^&]*)/g, m;

function googleAuthorizationRequest({ client_id, redirect_uri, scope, state, include_granted_scopes = true, response_type = 'code' }) {
    try {
        // Google's OAuth 2.0 endpoint for requesting an access token
        var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

        // Create element to open OAuth 2.0 endpoint in new window.
        var form = document.createElement('form');
        form.setAttribute('method', 'GET'); // Send as a GET request.
        form.setAttribute('action', oauth2Endpoint);

        // Parameters to pass to OAuth 2.0 endpoint.
        var params = {
            'access_type': 'offline',
            'client_id': client_id,
            'redirect_uri': redirect_uri,
            'scope': scope,// 'https://www.googleapis.com/auth/drive.metadata.readonly',
            'state': state,//'try_sample_request',
            'include_granted_scopes': include_granted_scopes,//'true',
            'response_type': response_type,// 'code'

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

    } catch (error) {

    }
}





window.googleAuthorizationRequest = googleAuthorizationRequest

window.googleAuth = googleAuth