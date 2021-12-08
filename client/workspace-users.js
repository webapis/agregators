customElements.define('workspace-users', class extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    const resources = await import('./resources.js')
    await resources.default()

    const { auth: { idToken, localId: uid }, workspace: { workspaceSelected:{title:workspaceName} } } = window.pageStore.state
    this.uid = uid
    window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
    document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`

    this.innerHTML = `
        <signed-in-as></signed-in-as>
        <div>
        <h5>Workspace Users:</h5>
    
      <user-table></user-table>
        </div>`
  }
})


customElements.define('user-table', class extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const { auth: { idToken, localId: uid }, workspace: { workspaceSelected:{title:workspaceName} }, workspaceUsers } = window.pageStore.state

    this.uid = uid
    window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
    window.FB_DATABASE.ref(`shared_workspaces/user/${uid}/workspaces/${workspaceName}/users`).on('value', (error, result) => {
      debugger;
      const users = result.data ? Object.entries(result.data) : []
      debugger;
      this.render({ workspaceUsers, users })
      debugger;
    })

  }


  render({ workspaceUsers, users }) {
    const { username, role } = workspaceUsers
    this.innerHTML = `<table class="table">
        <thead>
          <tr>
         
            <th scope="col">Username</th>
            <th scope="col">Role</th>
         
            <th scope="col">Invite</th>
            <th scope="col">Update</th>
          </tr>
          <tr>
         
          <th scope="col"><input class="form-control" placeholder="Username" id="username-input" name="username" value="${username}" /></th>
          <th scope="col">
           <select class="form-select"  name="role" id="roleSelect" name="role">
          <option selected>Choose...</option>
          <option value="user" ${role === "user" && "selected"} >user</option>
          <option value="administrator"  ${role === "administrator" && "selected"}>administrator</option>
        
        </select></th>
        
          <th scope="col"><button class="btn btn-secondary" id="invite-btn">Invite</button></th>
          <th scope="col"><button class="btn btn-secondary">Update</button></th>
        </tr>
        </thead>
        <tbody id="users-table">
        
     
          
        </tbody>
      </table>`

    users.forEach(user => {
      const userName = user[0]
      const role = user[1]['role']
      const state = user[1]['state']
      debugger;
      document.getElementById('users-table').insertAdjacentHTML('beforeend', `  <tr>
           
      <td>${userName}(${state})</td>
      <td>${role}</td>
   
      <td scope="col"><button class="btn btn-secondary">Edit</button></td>
      <td scope="col"><button class="btn btn-secondary">Remove</button></td>
    </tr>
`)
      debugger;
    })
    document.getElementById('username-input').addEventListener('input', (e) => {
      const { value, name } = e.target;
      window.pageStore.dispatch({ type: window.actionTypes.WORKSPACE_USER_INPUT_CHANGED, payload: { [name]: value } })

    })
    document.getElementById('roleSelect').addEventListener('change', (e) => {
      const { value, name } = e.target
      window.pageStore.dispatch({ type: window.actionTypes.WORKSPACE_USER_INPUT_CHANGED, payload: { [name]: value } })

    })

    document.getElementById('invite-btn').addEventListener('click', (e) => {
      debugger;
      const { auth: { idToken, localId: uid, screenName }, workspace: { workspaceSelected:{title:workspaceName,description} }, workspaceUsers: { username, role } } = window.pageStore.state
debugger;
      const updateInvitations = { [`invitations/${username}/workspaces/${workspaceName}`]: { inviter: screenName, state: 'pending', inviterId: uid,description } }
      const updateSharedWorkspaces = { [`shared_workspaces/user/${uid}/workspaces/${workspaceName}/users/${username}`]: { role, state: 'pending' } }
      window.FB_DATABASE.ref(`/`).update({ ...updateInvitations, ...updateSharedWorkspaces }, (error, data) => {

        debugger;

      })
      debugger;

    })


  }
})