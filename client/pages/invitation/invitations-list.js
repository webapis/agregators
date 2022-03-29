customElements.define('invitations-list', class extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    const resources = await import('../resources.js')
    await resources.default()
    
    const { auth: { idToken, localId: uid, screenName }, workspace: { workspaceSelected } } = window.pageStore.state
  


    this.innerHTML = `<div>Invitations to join workspace
        <signed-in-as></signed-in-as>
        <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Workspace to join</th>
      <th scope="col">Inviter</th>
      <th scope="col">State</th>
      <th scope="col">Join workspace</th>
      <th scope="col">Decline</th>
    </tr>
  </thead>
  <tbody id="invitations-container">

  
  </tbody>
</table>
        </div>`
    window.firebase().ref(`invitations/${screenName}/workspaces`).on('value', (error, response) => {

      const invitations = Object.entries(response.data)


      invitations.forEach(inv => {
        const workspaceName = inv[0]
        const inviter = inv[1]['inviter']
        const state = inv[1]['state']
        const inviterId = inv[1]['inviterId']
        const description = inv[1]['description']
        
        document.getElementById('invitations-container').insertAdjacentHTML('beforeend', `  <tr>
                <th scope="row">1</th>
                <td>${workspaceName}</td>
                <td>${inviter}</td>
                <td>${state}</td>
                <td><button class="btn btn-secondary" id="join-${workspaceName}-btn">Join Workspace</button></td>
                <td><button class="btn btn-secondary">Decline</button></td>
              </tr>`)
        

        document.getElementById(`join-${workspaceName}-btn`).addEventListener('click', async (e) => {
          const { auth: { idToken, localId: uid, screenName } } = window.pageStore.state

          const updateInvitations = { [`invitations/${screenName}/workspaces/${workspaceName}/state`]: 'joined' } 
          const updateSharedWorkspaces = { [`shared_workspaces/user/${inviterId}/workspaces/${workspaceName}/users/${screenName}/state`]: 'joined',[`shared_workspaces/user/${inviterId}/workspaces/${workspaceName}/users/${screenName}/uid`]: uid }
          const updateShared = { [`shared/user/${uid}/workspaces/${workspaceName}`]: { owner: inviter, accessLevel: 'shared',description } }
          await window.firebase().ref(`/`).update({ ...updateInvitations, ...updateSharedWorkspaces, ...updateShared })

      

        })
      })


    })

  }
})