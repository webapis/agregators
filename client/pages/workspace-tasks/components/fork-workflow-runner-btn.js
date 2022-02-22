
customElements.define('fork-workflow-runner-btn', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        //const { auth: { token } } = window.pageStore.state
        const { token } = JSON.parse(localStorage.getItem('auth'))

        this.render({ token })


    }

    render({ token }) {

        this.innerHTML = `<button class="btn btn-secondary"  id="fork-runner-btn">Fork runner</button>`

        document.getElementById('fork-runner-btn').addEventListener('click', async () => {
            try {
                const forkResponse = await fetch(`https://api.github.com/repos/webapis/workflow_runner/forks`, { method: 'post', headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' } })

                window.location.replace('/workspace-tasks.html')
            } catch (error) {



            }


        })
    }
})
