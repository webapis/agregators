

async function googleAuth({ navAfterAuth }) {
    var provider = new firebase.auth.GoogleAuthProvider();

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
            debugger;
            // firebase.database().ref('users')
            window.pageStore.dispatch({
                type: window.actionTypes.AUTH_SUCCESS,
                payload: { auth: { user, token }, navAfterAuth }
            });
            debugger;

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

window.googleAuth = googleAuth