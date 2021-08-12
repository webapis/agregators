customElements.define('app-shell', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        Promise.all([
            import('./air-store.js'),
            import('./reducer.js')
        ]).then(modules => {
            window.pageStore = modules[0].createStore(
                modules[1].default,
                modules[1].initState,
                'page-store'
            );
            window.actionTypes = modules[1].actionTypes;
            this.render();
        });
    }

    render() {
        this.innerHTML = `
        <top-navigation></top-navigation>
        <app-content></app-content>
        <app-footer></app-footer>
        `
    }
})


