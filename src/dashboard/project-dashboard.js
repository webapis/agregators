customElements.define('project-dashboard', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const projectId = this.getAttribute('project-id')
        this.innerHTML = `
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
    
        <div class="container">
            <div class="row pt-4">
            <h3 class="text-center">Project Name: ${projectId}
            </h3> 

            <monitor-component></monitor-component>
        </div>
    
        </div>`
    }

})


