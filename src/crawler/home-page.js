customElements.define('home-page', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `<div class="container">
        <fieldset> 
        <legend>Home:</legend>
        </fieldset>
        </div>`
    }
})