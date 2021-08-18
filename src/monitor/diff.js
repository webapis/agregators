function diff(t1, t2) {
    // const t1 = new Date(1579876543210) // your initial time
 //const t2 = new Date(1579987654321) // your later time
     
     const diff = t2-t1
     const SEC = 1000, MIN = 60 * SEC, HRS = 60 * MIN
 return  `${Math.floor(diff/HRS)}:${Math.floor((diff%HRS)/MIN).toLocaleString('en-US', {minimumIntegerDigits: 2})}:${Math.floor((diff%MIN)/SEC).toLocaleString('en-US', {minimumIntegerDigits: 2})}`
     
 }



function downloadFile ({downloadpath}){
    var storage = firebase.storage()
    var pathReference = storage.ref(downloadpath).getDownloadURL().then(url=>{

        var a = document.createElement('a');
                    a.href = url;
                    a.download = "filename.xlsx";
                    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                    a.click();    
                    a.remove();  //afterwards we remove the element again    
        console.log('url', url)
    })
}

function signin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        var credential = result.credential;
  
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // const firebase =firebase
        
        // The signed-in user info.
        var user = result.user;
        
        const ticket = firebase
          .database()
          .ref(`gitticket`)
        ticket.once('value', data => {
          
          const tkt = data.val()
          window.pageStore.dispatch({
            type: window.actionTypes.SIGNED_IN,
            payload: { user, ticket: tkt },
  
          });
          
        })
  
  
        // ...
      })
      .catch(error => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }
export {diff,downloadFile,signin}