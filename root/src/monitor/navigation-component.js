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
        const { user: { user: { uid, email } } } = state;
        
        const userRef = firebase
          .database()
          .ref(`users/${uid}`)
        userRef.on('value', (snapshot) => {
          const user = snapshot.val()
          if (!user) {
            userRef.set({ email })
          }
          
        })

        const userRoleRef = firebase
          .database()
          .ref(`users/${uid}/role`)
        userRoleRef.on('value', (snapshot) => {
          const role = snapshot.val()
          
          if (role === 'admin') {
            this.render({ user, role: 'admin' });
          } else {
            this.render({ user, role: 'user' });
          }
        })
          this.render({ user,role:'user' });
      });


      window.pageStore.subscribe(window.actionTypes.SIGNED_OUT, state => {
        const { user } = state;

        this.render({ user, role:'user' });
      });
    }

    render({ user, role }) {
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
        ${role === 'admin' ? `   <li class="nav-item">
        <a class="nav-link" href="#" id ="add-project">Add Project</a>
      </li>`: ''}
     
      </ul>
      <ul class="navbar-nav ">
      ${user ? `<li class="nav-link ">welcome,${user.user.email}</li>` : `  <li class="nav-item">
      <a class="nav-link " href="#" tabindex="-1" aria-disabled="true" id="login">Sign in</a>
    </li>`}
    ${user ? `   <li class="nav-item">
    <a class="nav-link " href="#" tabindex="-1" aria-disabled="true" id="signout">Sign out</a>
  </li>`:''}
 
  </ul>
    </div>
  </div>
</nav>
  `;
      if (!user) {
        document.getElementById('login').addEventListener('click', e => {
          e.preventDefault();
          window.signin();
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
      if (role === 'admin') {

        document
          .getElementById('add-project')
          .addEventListener('click', function () {
            // import('./edit-project.js').then(() => { });

            window.pageStore.dispatch({
              type: window.actionTypes.VIEW_CHANGED,
              payload: 'project-edit'
            });
          });
      }


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
