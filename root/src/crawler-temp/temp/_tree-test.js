
const container = {
    test_container: {
        workflows: {
            workflow_a: {
                workflows: {
                    workflow_a_a: {
                        workflows: {
                            workflows_a_a_a: { workflows: { workflow_a_a_a_a: {} } }
                        }
                    }
                }
            },
            workflow_b: {
                workflows: {
                    workflow_b_a: {

                    },
                    workflow_b_b: {
                        workflows: {
                            workflow_b_b_a: {}
                        }
                    }
                }
            },

        }
    }

}


const obj = Object.entries(container)
const containerName = obj[0][0]
const workflows = Object.entries(obj[0][1]['workflows'])

const containerElement = document.createElement('DIV')
containerElement.id = containerName
containerElement.className='row bg-info'
document.body.appendChild(containerElement)


function loopObjectProps({ parent, workflows }) {

    workflows.forEach(w => {
        const workflowName = w[0]
        console.log('workflowName', workflowName)
        const workflows = w[1] && Object.entries(w[1]['workflows'])
        console.log(workflowName, 'has child workflows', workflows)
        const workflowElement = document.createElement('DIV')
        workflowElement.id = workflowName
        workflowElement.insertAdjacentHTML('beforeend',`<h5 class="text-center">${workflowName}</h5>
                                                        <div class="row" id="${workflowName}-row"></div>
                                                            `)
        parent.appendChild(workflowElement)
        workflows.forEach(w => {
            const wfName = w[0]
            const childworkflows = w[1] && w[1]['workflows']
            console.log('childworkflows...', childworkflows)
            const workflowChildElement = document.createElement('DIV')

            workflowChildElement.id = wfName
            workflowChildElement.insertAdjacentHTML('beforeend',`<h5 class="text-center">${wfName}</h5>
            <div class="row" id="${wfName}-row"></div>
            `)
            workflowElement.appendChild(workflowChildElement)

            if (childworkflows) {
                const wf = Object.entries(childworkflows)
                const chldNodeName = JSON.stringify(wf[0][0])
                const chldNode = JSON.stringify(wf[0][1])

                if (chldNode === "{}") {
                    const workflowChldElement = document.createElement('DIV')

                    workflowChldElement.id = chldNodeName
                    workflowChldElement.insertAdjacentHTML('beforeend',`<h5 class="text-center">${chldNodeName}</h5>
                    <div class="row" id="${chldNodeName}-row"></div>
                    `)
                    workflowChildElement.appendChild(workflowChldElement)
                } else {
                    loopObjectProps({ parent: workflowChildElement, workflows: Object.entries(childworkflows) })
                }


            }

        })




    })


}
loopObjectProps({ parent: containerElement, workflows })

customElements.define('tree-container', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.innerHTML = `
        tree container
        `
    }

    traverseTree() {

    }
})




/*

const container = {
    test_container: {
        workflows: {
            workflow_a: {
                workflows: {
                    workflow_a_a: {
                        workflows: {
                            workflows_a_a_a: { workflows: { workflow_a_a_a_a: {} } }
                        }
                    }
                }
            },
            workflow_b: {
                workflows: {
                    workflow_b_a: {

                    },
                    workflow_b_b: {
                        workflows: {
                            workflow_b_b_a: {}
                        }
                    }
                }
            },

        }
    }

}


const obj = Object.entries(container)
const containerName = obj[0][0]
const workflows = Object.entries(obj[0][1]['workflows'])

const containerElement = document.createElement('DIV')
containerElement.id = containerName
containerElement.className='row bg-info'
document.body.appendChild(containerElement)


function loopObjectProps({ parent, workflows }) {

    workflows.forEach(w => {
        const workflowName = w[0]
        console.log('workflowName', workflowName)
        const workflows = w[1] && Object.entries(w[1]['workflows'])
        console.log(workflowName, 'has child workflows', workflows)
        const workflowElement = document.createElement('DIV')
        workflowElement.id = workflowName
        parent.appendChild(workflowElement)
        workflows.forEach(w => {
            const wfName = w[0]
            const childworkflows = w[1] && w[1]['workflows']
            console.log('childworkflows...', childworkflows)
            const workflowChildElement = document.createElement('DIV')

            workflowChildElement.id = wfName
            workflowElement.appendChild(workflowChildElement)
            

            if (childworkflows) {
                const wf = Object.entries(childworkflows)
                const chldNodeName = JSON.stringify(wf[0][0])
                const chldNode = JSON.stringify(wf[0][1])

                if (chldNode === "{}") {
                    const workflowChldElement = document.createElement('DIV')

                    workflowChldElement.id = chldNodeName
                    workflowChildElement.appendChild(workflowChldElement)
                } else {
                    loopObjectProps({ parent: workflowChildElement, workflows: Object.entries(childworkflows) })
                }


            }

        })




    })


}
loopObjectProps({ parent: containerElement, workflows })

customElements.define('tree-container', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.innerHTML = `
        tree container
        `
    }

    traverseTree() {

    }
})
*/