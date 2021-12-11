customElements.define('error-displayer', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        this.innerHTML = ``


        this.render()

        window.pageStore.subscribe(window.actionTypes.CLIENT_ERROR, (state) => {
            const { clientError } = state
            if (clientError) {
                this.render()
            }

        })

    }

    render() {

        const { clientError } = window.pageStore.state
        
        if (clientError) {
            this.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> ${clientError}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" id="close-error-btn"></button>
          </div>`

          document.getElementById('close-error-btn').addEventListener('click',(e)=>{
              window.pageStore.dispatch({type:window.actionTypes.CLEAR_ERROR_DISPLAY})
          })
        } else {
            this.innerHTML = ''
        }
    }
})