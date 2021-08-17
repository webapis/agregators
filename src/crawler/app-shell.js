customElements.define('app-shell', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.render();
        Promise.all([
            import('./air-store.js'),
            import('./reducer.js'),
            
        ]).then(modules => {
            window.pageStore = modules[0].createStore(
                modules[1].default,
                modules[1].initState,
                'page-store'
            );
            window.actionTypes = modules[1].actionTypes;
          
        }).catch(error=>{
            console.log('error',error)
        })
    }

    render() {
        this.innerHTML = `
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-U1DAWAznBHeqEIlVSCgzq+c9gqGAJn5c/t99JyeKa9xxaYpSvHU5awsuZVVFIhvj"
        crossorigin="anonymous"></script>
      

    
    <!-- The core Firebase JS SDK is always required and must be listed first -->
    <script src="https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.6.5/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.6.5/firebase-database.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-storage.js"></script>
    <!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->

    <script>
        // Your web app's Firebase configuration
        var firebaseConfig = {
            apiKey: "AIzaSyDb8Z27Ut0WJ-RH7Exi454Bpit9lbARJeA",
            authDomain: "turkmenistan-market.firebaseapp.com",
            databaseURL: "https://turkmenistan-market.firebaseio.com",
            projectId: "turkmenistan-market",
            storageBucket: "turkmenistan-market.appspot.com",
            messagingSenderId: "117708549296",
            appId: "1:117708549296:web:7e0b59b9a61acdec261f75"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
    </script>

    <script src="./auth.js"></script>
    <script src="./login-page.js"></script>
<script src="home-page.js"></script>
<script src="project-dashboard.js"></script>
<script src="project-list.js"></script>
<script src="./project-editor.js"></script>
<script src="./app-footer.js"></script>
<script src="./app-content.js"></script>
<script src="./top-navigation.js"></script>
    <script src="air-store.js"></script>
    <script src="reducer.js"></script>
      
        `
    }
})


