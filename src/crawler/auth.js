

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
            if (isNewUser) {
                debugger;
                firebase.database().ref(`users/${user.uid}`).set({ email: user.email, role: 'standard' }, (error) => {
                    if (error) {
                        window.pageStore.dispatch({
                            type: window.actionTypes.ERROR,
                            payload: error
                        });
                    } else {
                        debugger;
                       
                        window.pageStore.dispatch({
                            type: window.actionTypes.AUTH_SUCCESS,
                            payload: { auth: { user, token, role: 'standard' }, navAfterAuth }
                        });
                        window.location.replace(navAfterAuth);
                    }
                })
            } else {

                firebase.database().ref(`users/${user.uid}`).on('value', snap => {
                    const role = snap.val()['role']
                    window.pageStore.dispatch({
                        type: window.actionTypes.AUTH_SUCCESS,
                        payload: { auth: { user, token, role }, navAfterAuth }
                    });
                    window.location.replace(navAfterAuth);
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

window.googleAuth = googleAuth