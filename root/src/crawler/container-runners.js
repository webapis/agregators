customElements.define('container-runners', class extends HTMLElement{
    constructor(){
        super()
    }

  async  connectedCallback(){
        const resources = await import('./resources.js')
        await resources.default()
        this.innerHTML=`<div>
        <h5>Container Runners:</h5>
        </div>`
    }
})