
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
    window.projectUrl =window.location.hostname==='localhost'?'/api/fb-dev':'/api/fb-prod'

    window.actionTypes = loadedResources[1].actionTypes;

    

}





