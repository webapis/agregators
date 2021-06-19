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
      this.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">WDS</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0 d">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#" id="show-home-component">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" id="show-projest-list">Projects</a>
        </li>
        <li class="nav-item">
        <a class="nav-link" href="#" id ="add-project">Add Project</a>
      </li>
      </ul>
      <ul class="navbar-nav ">
      <li class="nav-item">
      <a class="nav-link " href="#" tabindex="-1" aria-disabled="true" id="login">Sign in</a>
    </li>
    <li class="nav-item">
    <a class="nav-link " href="#" tabindex="-1" aria-disabled="true" id="signout">Sign out</a>
  </li>
  </ul>
    </div>
  </div>
</nav>
  `;
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

      document
        .getElementById('show-projest-list')
        .addEventListener('click', e => {
          e.preventDefault();
          window.pageStore.dispatch({
            type: window.actionTypes.VIEW_CHANGED,
            payload: 'project-list'
          });
        });

      document
        .getElementById('add-project')
        .addEventListener('click', function () {
         // import('./edit-project.js').then(() => { });

          window.pageStore.dispatch({
            type: window.actionTypes.VIEW_CHANGED,
            payload: 'project-edit'
          });
        });

      document
        .getElementById('show-home-component')
        .addEventListener('click', function () {


          window.pageStore.dispatch({
            type: window.actionTypes.VIEW_CHANGED,
            payload: 'home-component'
          });
        });
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
      const ticket = firebase
        .database()
        .ref(`gitticket`)
      ticket.once('value', data => {
        debugger;
        const tkt = data.val()
        window.pageStore.dispatch({
          type: window.actionTypes.SIGNED_IN,
          payload: { user, ticket: tkt },

        });
        debugger;
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
