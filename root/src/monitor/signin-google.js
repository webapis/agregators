customElements.define('signin-google', class extends HTMLElement {
    constructor(){
        super()
    }

    connectedCallback(){
        this.innerHTML=`<div> <button class="btn btn-primary" id ="signin-goole-btn">Sign in with Google</button></div>`

        document.getElementById('signin-goole-btn').addEventListener('click',()=>{
            window.signin()
        })
    }
})