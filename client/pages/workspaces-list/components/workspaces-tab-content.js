
customElements.define('workspaces-tab-content', class extends HTMLElement {
    constructor() {
        super()
    }

   async connectedCallback() {
        const { localId: uid } = JSON.parse(localStorage.getItem('auth'))
        const wsType = this.getAttribute('ws-type')
        let workspacesRef = ''
        if (wsType === 'private-tab') {
            workspacesRef = `private/${uid}/workspaces`
        }
        else if (wsType === 'public-tab') {
            workspacesRef = `public/workspaces`
        } else {
            workspacesRef = `shared/${uid}/workspaces`
        }
        this.innerHTML = `<div id="workspaces"></div>`
        const ws = await window.firebase().ref(workspacesRef).get()

        if (ws) {
            const workspaces = Object.entries(ws)
            this.render({ workspaces })
        }


     

    }
        render({ workspaces }){
            
            workspaces.forEach(ws => {
                const title = ws[0]
                const { accessLevel, description, owner } = ws[1]
                
                document.getElementById('workspaces').insertAdjacentHTML(`beforeend`, `<workspace-component title="${title}" accesslevel="${accessLevel}" description="${description}" owner="${owner}" id="${title}-ws"></workspace-component>`)
            })

        }
    })