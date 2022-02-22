
customElements.define('workspaces-tab-content', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        const {localId: uid  } = JSON.parse(localStorage.getItem('auth'))
        const wsType =this.getAttribute('ws-type')
        let workspacesRef = ''
        if (wsType === 'private-tab') {
            workspacesRef = `private/${uid}/workspaces`
        }
        else if (wsType === 'public-tab') {
            workspacesRef = `public/workspaces`
        } else {
            workspacesRef = `shared/${uid}/workspaces`
        }

        window.FB_DATABASE.ref(workspacesRef).get((error, ws) => {
            
            if (ws) {
                const workspaces = Object.entries(ws)
                this.render({ workspaces })
            } 
        })

        this.innerHTML=`<div id="workspaces"></div>`
    }

    render({workspaces}){
        workspaces.forEach(ws => {
            const title = ws[0]
            const { accessLevel, description, owner } = ws[1]

            document.getElementById('workspaces').insertAdjacentHTML(`beforeend`, `<workspace-component title="${title}" accesslevel="${accessLevel}" description="${description}" owner="${owner}" id="${title}-ws"></workspace-component>`)
        })

    }
})