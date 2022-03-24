

customElements.define('signed-in-as',
    class extends HTMLElement {
        constructor() {
            super()
        }

            connectedCallback() {
             const auth =JSON.parse(localStorage.getItem('auth'))
            if (auth){
                const { idToken, localId: uid,screenName } =auth
                this.uid = uid
    
                document.getElementById('top-bar')&&  document.getElementById('top-bar').insertAdjacentHTML('beforeend', `
                <div class="mt-1" id="profile">
                <span>Signed in as</span>
                <span class="fw-bolder" id="screenname">${screenName}</span>
                </div>`)
                
            }
          

           

        }

      
    }

)


