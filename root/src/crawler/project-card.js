customElements.define('project-card', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {

        const auth = window.pageStore.state.auth

        const projectName = this.getAttribute('project-name')
        const description = this.getAttribute('description')
        const githuburl = this.getAttribute('githuburl')


        this.innerHTML = `<div class="card mt-3">
        <div class="card-body">
        <div class="row">
        <div class="col">
        <img src="http://webdata-scraping.com/wp-content/uploads/2016/10/Octoparse-150x150.png" width="50" height="50"/>
        </div>
        <h5 class="card-title col">${projectName}</h5>
        </div>
       
        <p class="card-text">${description}</p>
        <p class="card-text">${githuburl}</p>
        <a href="#" class="card-link" id="${projectName}-dashboard-link" >Go to dashboard</a>
        ${auth && auth.role === 'admin' ? `<a href="#" class="card-link" id="${projectName}-project-editor-link">Edit project</a>` : ''}
        </div>
        <div class="card-footer text-muted">
        <eye-icon></eye-icon><span class="badge text-secondary">10</span>
      </div>
        </div>`
        document.getElementById(`${projectName}-dashboard-link`).addEventListener('click', async (e) => {
            e.preventDefault()
            const { auth: { token } } = window.pageStore.state
            const gihubowner = githuburl.substring(githuburl.indexOf('.com/') + 5, githuburl.lastIndexOf('/'))

            //GET USERNAME
            const userNameReponse = await fetch(`https://api.github.com/user`, { headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
            const userNameData = await userNameReponse.json()
            const { login } = userNameData
            //  const brnExts = await branchExists({ branchName: projectName, branchOwner: login, repo: 'agregators' })
            
            fetch(`https://api.github.com/repos/${login}/agregators/branches`).then(response => response.json()).then(async data => {
                const branches = data
                const bExist = branches.filter(b => b.name === projectName).length > 0
                if (bExist) {
                    
                    await deleteBranch({ owner: login, repo: 'agregators', branchName: projectName, token })
                    
                    await CopySourceCode({ gihubowner, projectName, login, token })
                    return Promise.resolve(true);

                } else {
                    await CopySourceCode({ gihubowner, projectName, login, token })
                    
                    return Promise.resolve(true);
                }
              
            }).then(resolved => {
                
                const { auth: { email, localId: uid, idToken } } = window.pageStore.state;

                const userProjectsRef = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com').ref(`myprojects/${uid}/${projectName}`)

                userProjectsRef.on('value', (error, snap) => {

                    const dataObject = JSON.parse(snap.data)['data']



                    if (dataObject === null) {

                        const projectTemplatesRef = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com').ref(`projects/${projectName}`)
                        projectTemplatesRef.on('value', (error, snap) => {
                            const dataObject = JSON.parse(snap.data)['data']

                            const description = dataObject['description']

                            userProjectsRef.set({ description, githuburl }, () => {
                                window.pageStore.dispatch({
                                    type: window.actionTypes.CONTENT_VIEW_CHANGED,
                                    payload: { contentView: 'project-dashboard', selectedDashboard: projectName }
                                });
                                window.location.replace('/project-dashboard.html')
                            })

                        })
                    } else {

                        window.pageStore.dispatch({
                            type: window.actionTypes.CONTENT_VIEW_CHANGED,
                            payload: { contentView: 'project-dashboard', selectedDashboard: projectName }
                        });
                        window.location.replace('/project-dashboard.html')

                    }
                })



                window.pageStore.dispatch({
                    type: window.actionTypes.CONTENT_VIEW_CHANGED,
                    payload: { contentView: 'project-dashboard', selectedDashboard: projectName }
                });
            })






        })
        document.getElementById(`${projectName}-project-editor-link`) && document.getElementById(`${projectName}-project-editor-link`).addEventListener('click', (e) => {
            e.preventDefault()


            window.pageStore.dispatch({
                type: window.actionTypes.PROJECT_EDITOR_SELECTED,
                payload: { projectName, description }
            });
            window.location.replace('/project-editor.html')
        })



    }//callback


})


customElements.define('eye-icon', class extends HTMLElement {
    constructor() {
        super()

        this.innerHTML = `    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
      </svg>`
    }
})




async function branchExists({ branchName, branchOwner, repo }) {
    try {
        const getbranches = await fetch(`https://api.github.com/repos/${branchOwner}/${repo}/branches`)

        const branches = await getbranches.json()
        const bExist = branches.find(b => b.name === branchName)

        return bExist
    } catch (error) {
        console.log('error', error)
    }
}


async function deleteBranch({ owner, repo, branchName, token }) {
    try {
        const deletUrl = `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branchName}`


        const responseDeleteABranch = await fetch(deletUrl, { method: 'delete', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })

        
        return responseDeleteABranch.text();
    } catch (error) {
        
        console.log('error', error)
    }
}


async function getSourceCodeTree({ gihubowner, projectName }) {
    // Retrieve source code for project
    //Retrieved source code will be copied to project branch of forked agregators repo
    //---- List branches endpoint----
    /*required for the next endoint*/
    const response = await fetch(`https://api.github.com/repos/${gihubowner}/${projectName}/branches`)
    const data = await response.json()
    const mainSha = data.find(d => d.name === 'main')
    const { commit: { sha } } = mainSha

    //------Git database / Get a tree endpoint------
    /*required to retrieve list of file and folder into*/
    const treeResponse = await fetch(`https://api.github.com/repos/${gihubowner}/${projectName}/git/trees/${sha}?recursive=1`)
    const treeData = await treeResponse.json()
    const { tree } = treeData
    
    return tree
}

async function getPluginsSourceCodeTree(){
       // Retrieve source code for project
    //Retrieved source code will be copied to project branch of forked agregators repo
    //---- List branches endpoint----
    /*required for the next endoint*/
    const response = await fetch(`https://api.github.com/repos/aggregationplugins/aggregation-plugins/branches`)
    const data = await response.json()
    const mainSha = data.find(d => d.name === 'main')
    const { commit: { sha } } = mainSha

    //------Git database / Get a tree endpoint------
    /*required to retrieve list of file and folder into*/
    const treeResponse = await fetch(`https://api.github.com/repos/aggregationplugins/aggregation-plugins/git/trees/${sha}?recursive=1`)
    const treeData = await treeResponse.json()
    const { tree } = treeData
    
    return tree
}

async function createNewBranch({ login, token, projectName }) {
    //Create a new branch with project name in forked agregators repo
    //Project source code will be copied here
    //---- List branches endpoint----
    /*required to retrieve sha of the master branch with will be used
    in next api call*/
    const response = await fetch(`https://api.github.com/repos/${login}/agregators/branches`)

    const data = await response.json()
    const master = data.find(d => d.name === 'master')
    const { commit: { sha: mastersha } } = master
    
    //2.Create a new branch with project name
    await fetch(`https://api.github.com/repos/${login}/agregators/git/refs`, { method: 'post', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` }, body: JSON.stringify({ sha: mastersha, ref: `refs/heads/${projectName}` }) })


}

async function pushContentToProjectBranch({ gihubowner, projectName, login, token, tree }) {
    const getContent = async function ({ path }) {
        const response = await fetch(`https://api.github.com/repos/${gihubowner}/${projectName}/contents/${path}`)
        const data = await response.json()

        return data;
    }
    const promises = []
    const withoutTypeTree = tree.filter(f => f.type !== 'tree')
    const contents =[]
    for (let t of withoutTypeTree) {
        const content = await getContent({ path: t.path })
        
        contents.push(content)

    }

    
 

    for(let cont of contents){
        
        const {content,path} =cont
        
         const response = await fetch(`https://api.github.com/repos/${login}/agregators/contents/${path}`, { method: 'put', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` }, body: JSON.stringify({ message: 'coder content', content, branch: projectName }) })
        const data = await response.text()
        
    }


}

async function CopySourceCode({ gihubowner, projectName, login, token }) {
    try {
        await createNewBranch({ login, token, projectName })
        const tree = await getSourceCodeTree({ gihubowner, projectName })
       await pushContentToProjectBranch({ gihubowner, projectName, login, token, tree })
       const pluginsTree = await getPluginsSourceCodeTree()
       await pushContentToProjectBranch({ gihubowner, projectName, login, token, tree:pluginsTree })
    } catch (error) {
        
    }
 

}