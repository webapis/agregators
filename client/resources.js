
export default async () => {
    const loadedResources = await Promise.all([
        import('./air-store.js'),
        import('./reducer.js'),
        import('./auth.js'),
        import('./firebase-rest.js'),

        import('https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js')])
    window.pageStore = loadedResources[0].createStore(
        loadedResources[1].default,
        loadedResources[1].initState,
        'page-store'
    );
    window.projectUrl =window.location.hostname==='localhost'?'/api/fb-dev':'https://workflow-prod-799d4-default-rtdb.firebaseio.com'
    window.webapikey=window.location.hostname==='localhost'?'AIzaSyDb8Z27Ut0WJ-RH7Exi454Bpit9lbARJeA':'AIzaSyCM7LDPIq6eelnMH_A8SARtIBDT5Zi5tK8'
    window.actionTypes = loadedResources[1].actionTypes;

    

}





