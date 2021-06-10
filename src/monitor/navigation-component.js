/* eslint-disable no-undef */
customElements.define(
  'navigation-component',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const { state: { user } } = window.pageStore;

      this.render({ user });

      window.pageStore.subscribe(window.actionTypes.SIGNED_IN, state => {
        const { user } = state;

        this.render({ user });
      });
      window.pageStore.subscribe(window.actionTypes.SIGNED_OUT, state => {
        const { user } = state;

        this.render({ user });
      });
    }

    render({ user }) {
      this.innerHTML = `<ul class="nav">
      ${user
        ? ` <li class="nav-item" id =signout>
      <a class="nav-link" href="#">Signout</a>
    </li>`
        : ''}
     
      ${user === null
        ? `<li class="nav-item" id="login">
          <a class="nav-link" href="#">
            Signin
          </a>
        </li>`
        : ''}
       
     
    </ul>`;
      if (!user) {
        document.getElementById('login').addEventListener('click', e => {
          e.preventDefault();
          signin();
        });
      } else {
        document.getElementById('signout').addEventListener('click', e => {
          e.preventDefault();
          signout();
        });
      }
    }
  }
);

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
      debugger;
      // The signed-in user info.
      var user = result.user;
      window.pageStore.dispatch({
        type: window.actionTypes.SIGNED_IN,
        payload: user
      });

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

function signout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      window.pageStore.dispatch({
        type: window.actionTypes.SIGNED_OUT,
        payload: null
      });
    })
    .catch(error => {
      // An error happened.
    });
}
