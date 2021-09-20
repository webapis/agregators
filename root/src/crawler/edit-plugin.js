customElements.define('edit-plugin', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        this.innerHTML=`<div>Edit pligin</div>`
    }
})