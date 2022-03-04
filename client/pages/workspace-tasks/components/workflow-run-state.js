const { TimeoutSettings } = require("puppeteer")

customElements.define('workflow-run-state', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        this.innerHTML=`<div>Workflow state</div>`
    }
})