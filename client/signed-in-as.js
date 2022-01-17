

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
                this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
                this.FB_DATABASE.ref(`invitations/${screenName}/workspaces`).get((error,response)=>{
                    const data=response && response &&  Object.keys(response)
                    this.innerHTML=``
                   
                    
                    document.getElementById('top-bar').insertAdjacentHTML('beforeend', `
                <div class="mt-1" id="profile">
                <span>Signed in as</span>
                <span class="fw-bolder" id="screenname">${screenName}</span>
                <span class="fw-bolder">
                <a href="/invitations.html" >
        
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                     <path fill-rule="evenodd" d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                </svg>
                <span class=" top-0 start-100 translate-middle badge rounded-pill bg-info">${data? data.length:0}</span>
                </a>
               
                </span>
                </div>`)
                })
            }
          

           

        }

      
    }

)


/*
   if(!document.getElementById('profile')){
                
                window.FB_DATABASE.ref(`invitations/${screenName}/workspaces`).get((error,response)=>{
                    const data=response && response &&  Object.keys(response)
               
                    const auth = window.pageStore.state.auth
                    document.getElementById('top-bar').insertAdjacentHTML('beforeend', `
                <div class="mt-1" id="profile">
                <span>Signed in as</span>
                <span class="fw-bolder" id="screenname">${auth.screenName}</span>
                <span class="fw-bolder">
                <a href="/invitations.html" >
        
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                     <path fill-rule="evenodd" d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                </svg>
                <span class=" top-0 start-100 translate-middle badge rounded-pill bg-info">${data? data.length:0}</span>
                </a>
               
                </span>
                </div>`)
                })

            }
*/