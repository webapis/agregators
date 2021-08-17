






Promise.all([
    import('./air-store.js'),
    import('./reducer.js'),
    import('https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/8.6.5/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/8.6.5/firebase-database.js'),
    import('https://www.gstatic.com/firebasejs/8.6.8/firebase-storage.js'),
    import('https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js'),
    import('./auth.js'),

]).then(modules => {
    window.pageStore = modules[0].createStore(
        modules[1].default,
        modules[1].initState,
        'page-store'
    );
    window.actionTypes = modules[1].actionTypes;

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

}).catch(error => {
    console.log('error', error)
})