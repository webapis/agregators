customElements.define('error-component', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {

        const { state: { error } } = window.pageStore;
     
        if (error) {
            this.render({ error })
        } else {
            this.innerHTML = ``
        }
        window.pageStore.subscribe(window.actionTypes.ERROR_DISMISSED, () => {
            this.innerHTML = ``
          });

          window.pageStore.subscribe(window.actionTypes.ERROR, (state) => {
              const {error}=state
              this.render({ error })
          });
    }

    render({ error }) {
        this.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Attention</strong> ${error.message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" id="dismiss-btn"></button>
      </div>`

        document.getElementById('dismiss-btn').addEventListener('click', function () {
        
            window.pageStore.dispatch({
                type: window.actionTypes.ERROR_DISMISSED,

            });
        })
    }
})