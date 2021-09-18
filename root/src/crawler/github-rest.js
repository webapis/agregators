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

async function getPluginsSourceCodeTree() {
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
    debugger;
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
    const contents = []
    for (let t of withoutTypeTree) {
        const content = await getContent({ path: t.path })

        contents.push(content)

    }




    for (let cont of contents) {

        const { content, path } = cont

        const response = await fetch(`https://api.github.com/repos/${login}/agregators/contents/${path}`, { method: 'put', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` }, body: JSON.stringify({ message: 'coder content', content, branch: projectName }) })
        const data = await response.text()

    }




}
async function pushPluginContentToProjectbranch({ projectName, login, token, tree }) {
    const getContent = async function ({ path }) {
        const response = await fetch(`https://api.github.com/repos/aggregationplugins/aggregation-plugins/contents/${path}`)
        const data = await response.json()

        return data;
    }
    const promises = []
    const withoutTypeTree = tree.filter(f => f.type !== 'tree')
    const contents = []
    for (let t of withoutTypeTree) {
        const content = await getContent({ path: t.path })

        contents.push(content)

    }




    for (let cont of contents) {

        const { content, path } = cont

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
        await pushPluginContentToProjectbranch({ projectName, login, token, tree: pluginsTree })
    } catch (error) {

    }


}


async function mergeUpstream() {

    const { auth: { screenName: owner, token } } = window.pageStore.state
    const fetchPath = `https://api.github.com/repos/${owner}/agregators/merge-upstream`

    await fetch(fetchPath, {
        method: 'post',
        headers: {
            authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({ branch: 'master' })
    })
}

export default CopySourceCode

export { deleteBranch, branchExists,mergeUpstream }