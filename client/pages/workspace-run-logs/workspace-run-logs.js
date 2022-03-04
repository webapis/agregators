
customElements.define('workspace-run-logs', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {

        this.innerHTML = `loading...`
        const resources = await import('/js/resources.js')
        await resources.default()

        const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))

        const { idToken, localId: uid } = JSON.parse(localStorage.getItem('auth'))
        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        document.getElementById('workspace-breadcrumb').innerText = `Workspace(${workspaceName})`
        this.innerHTML = `<div class="accordion" id="accordion-container">
        <h7>Workspace run results:</h7>
        </div>`
        const workspaceLogRef =`/workspaceLogs/${workspaceName}/logs`
        const workspaceLogObjests =await getLogObjects(workspaceLogRef)
        debugger;
     

            for (let wsrunid in workspaceLogObjests) {
debugger;
                const last = workspaceLogObjests[wsrunid]['last']
                const start = workspaceLogObjests[wsrunid]['start']
                const success = workspaceLogObjests[wsrunid]['success']
                const failed = workspaceLogObjests[wsrunid]['failed']
                const totalTasks = workspaceLogObjests[wsrunid]['totalTasks']
                const totalWorkflows = workspaceLogObjests[wsrunid]['totalWorkflows']
                debugger;
         
                document.getElementById('accordion-container').insertAdjacentHTML('beforeend', `
                <workspace-accordion-item last="${last}" start="${start}" success="${success}" failed="${failed}" totalTasks="${totalTasks}" totalWorkflows="${totalWorkflows}" data-id="${wsrunid}-ws" wsrunid="${wsrunid}">
                </workspace-accordion-item>`)
            }
        
      
    }
})



function timespan(date2, date1) {


    var diff = date2.getTime() - date1.getTime();

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    var hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    var mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

    var seconds = Math.floor(diff / (1000));
    diff -= seconds * (1000);

    console.log(days + " days, " + hours + " hours, " + mins + " minutes, " + seconds + " seconds");
    return { days, hours, mins, seconds }
}

window.timespan = timespan

async function getLogObjects(ref){

    const auth=JSON.parse( localStorage.getItem('auth'))
    const {idToken}=auth

    const fetchUrl = `${window.projectUrl}/${ref}/.json?auth=${idToken}`
    const getResponse =await   fetch(fetchUrl, { method: 'GET'})
    const getJsonData =await getResponse.json()

    return getJsonData

}

window.getLogObjects=getLogObjects