


const workspace = {
  containers: {
    container_a: {
      // wflow_a: { workflows: { wflow_a_a: {}, wflow_a_b: {} } },
      wflow_b: {
        workflows: {
          wflow_b_a: {},
          wflow_b_b: {},
          wflow_b_c: { workflows: { wflow_b_c_a: {} } }
        }
      }
    }
  }
}







function traverseWorkflow(containerWorkflows, parent, workflowPath) {
const workflowName =Object.entries(containerWorkflows)[0][0]

  const rowForArrow = document.createElement('DIV')
  rowForArrow.className = `row`

  const workflowTreeContainer =document.getElementById('workflow-tree-container')
  
  workflowTreeContainer.appendChild(rowForArrow)



  const arrow = document.createElement('DIV')
  arrow.className = `col-12 text-center`
  arrow.insertAdjacentHTML('beforeend', `<workflow-arrow></workflow-arrow>`)
  rowForArrow.appendChild(arrow)
  const rowForWorkflows = document.createElement('DIV')
rowForWorkflows.className = `row`
workflowTreeContainer.appendChild(rowForWorkflows)

const workflowElement = document.createElement('DIV')
workflowElement.className = `col-12 text-center`


workflowElement.insertAdjacentHTML('beforeend', `<workflow-element workflow-name="${workflowName}" workflow-path="${workflowPath}" id="${workflowName}"></workflow-element>`)

rowForWorkflows.appendChild(workflowElement)

  //has workflow children

const workflows=Object.values(containerWorkflows)[0]['workflows']

    if(workflows){
      const rowsForWorkflows = document.createElement('DIV')
      rowsForWorkflows.className = `row`
      rowsForWorkflows.id= "10"
      workflowTreeContainer.appendChild(rowsForWorkflows)
      
      const wfArray=Object.entries(workflows)
      const totalWorkflows =workflows===undefined?0: wfArray.length
      const cols = Math.round(12 / totalWorkflows)
      //draw donarrow
    
      wfArray.forEach(w => {
        
     
       const arrow = document.createElement('DIV')
       arrow.className = `col-${cols} text-center`
       arrow.insertAdjacentHTML('beforeend', `<workflow-arrow></workflow-arrow>`)
        
      const prnt= document.getElementsByClassName('row')[document.getElementsByClassName('row').length-1]
      
      prnt.appendChild(arrow)
     
     })
     
     const rowForWorkflows = document.createElement('DIV')
     rowForWorkflows.className = `row`
     workflowTreeContainer.appendChild(rowForWorkflows)
     //draw workflows
     wfArray.forEach(w => {
     
       const curentworkflowName = w[0]
       const subWorkflows=w[1]['workflows']
       const workflowElement = document.createElement('DIV')
       workflowElement.className = `col-${cols} text-center`
       const nextWorkflowPath = `${workflowPath}/workflows/${workflowName}`
       
       workflowElement.insertAdjacentHTML('beforeend', `<workflow-element workflow-name="${curentworkflowName}" workflow-path="${nextWorkflowPath}"></workflow-element>`)
     
       rowForWorkflows.appendChild(workflowElement)
     
     
       
       if(subWorkflows){
         
        traverseWorkflow(subWorkflows, workflowElement, nextWorkflowPath)

       }
       
     
     })
    
     
     } 
}

customElements.define('workflow-tree', class extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    const resources = await import('./resources.js')
    await resources.default()
    const { workspace: { workspaceSelected }, wfContainer: { selectedContainer }, auth: { idToken, localId: uid } } = window.pageStore.state
    document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceSelected})`
    document.getElementById('workflow-tree-breadcrumb').innerText = `Container(${selectedContainer})`
    this.uid = uid
    this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')

    this.FB_DATABASE.ref(`workspaces/${workspaceSelected}/containers/${selectedContainer}`).on('value', (error, response) => {

      if (response.data) {
        
        const workflows = Object.entries(response.data)[1]&& Object.entries(response.data)[1][1]

        const containerName = selectedContainer
        const containerElement = document.getElementById('container')
        const div = document.createElement('DIV')
        div.className = 'col-12 text-center'
  
        containerElement.appendChild(div)
        containerElement.insertAdjacentHTML('beforebegin', `<container-element container-name="${containerName}" class="d-flex justify-content-center"></container-element>`)
    
        const workflowPath = `workspaces/${workspaceSelected}/containers/${selectedContainer}`      
        if(workflows){

          traverseWorkflow(workflows, div, workflowPath)

        } else{

          
          //add top workflow

        }
       
        // document.getElementById('workflows').innerHTML = ``
        

      } else {

        document.getElementById('workflows').innerHTML = `No worklows available`

      }



    })
    // const tree = Object.entries(workspace)
    // const container = Object.entries(tree[0][1])
    // const containerName = container[0][0]

    // const containerElement = document.getElementById('container')
    // const div = document.createElement('DIV')
    // div.className = 'col-12 text-center'
    // // div.textContent = containerName
    // containerElement.appendChild(div)
    // containerElement.insertAdjacentHTML('beforebegin', `<container-element container-name="${containerName}" class="d-flex justify-content-center"></container-element>`)
    // const containerWorkflows = container[0][1]
    // const workflowPath =`${workspaceSelected}/${selectedContainer}`
    // 
    // traverseWorkflow(containerWorkflows, div)
    // this.innerHTML = ``
  }
})

customElements.define('workflow-arrow', class extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    this.innerHTML = `<p class="btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
  </svg></p>`
  }
})



customElements.define('workflow-element', class extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {

    const workflowName = this.getAttribute('workflow-name')
     const workflowPath = this.getAttribute('workflow-path')
     console.log('...',workflowName,workflowPath)

    this.innerHTML =
      `<div class="row bg-info m-1" id=${workflowName}">
<span class="col mb-1"> ${workflowName}</span>
<div class="col-12 mb-1">
<button class="btn btn-sm btn-warning">
<div class="spinner-grow spinner-grow-sm text-success" role="status">
<span class="visually-hidden">Loading...</span>
</div>
</button>
<button class="btn btn-sm btn-warning" id="add-workflow-to-container-${workflowName}-btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
</svg></button>
<button class="btn btn-sm btn-warning"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
<path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
<path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
</svg></button>
</div>
</div>`

    document.getElementById(`add-workflow-to-container-${workflowName}-btn`).addEventListener('click', (e) => {
      const { workspace: { workspaceSelected }, wfContainer: { selectedContainer }, auth: { idToken, localId: uid } } = window.pageStore.state
      const newWorkflowPath = `${workflowPath}/workflows/${workflowName}`
      console.log('newWorkflowPath',newWorkflowPath)
      window.pageStore.dispatch({ type: window.actionTypes.WORKFLOW_PATH_CHANGED, payload: newWorkflowPath })
      window.location.replace('/workflow-editor.html')
      

    })

  }


})


customElements.define('container-element', class extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {

    const { workspace: { workspaceSelected }, wfContainer: { selectedContainer }, auth: { idToken, localId: uid } } = window.pageStore.state
    this.uid = uid
    this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')
    
    const containerName = this.getAttribute('container-name')

    this.innerHTML = `<div class="row bg-info m-1" id=${containerName}">
    <span class="col mb-1 text-center"> ${containerName}</span>
    <div class="col-12 mb-1 text-center">
    <button class="btn btn-sm btn-warning">
    <div class="spinner-grow spinner-grow-sm text-success" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>
    </button>
    <button class="btn btn-sm btn-warning" id="add-workflow-to-container-btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
    </svg></button>
    <button class="btn btn-sm btn-warning"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
    </svg></button>
    </div>
    </div>`

    document.getElementById('add-workflow-to-container-btn').addEventListener('click', (e) => {
      const { workspace: { workspaceSelected }, wfContainer: { selectedContainer }, auth: { idToken, localId: uid } } = window.pageStore.state
      const newWorkflowPath = `workspaces/${workspaceSelected}/containers/${selectedContainer}`

      console.log('newWorkflowPath',newWorkflowPath)
      debugger;
      window.pageStore.dispatch({ type: window.actionTypes.WORKFLOW_PATH_CHANGED, payload: newWorkflowPath })
      window.location.replace('/workflow-editor.html')
      

    })
  }



})









// customElements.define('diragram-component', class extends HTMLElement {
//   constructor() {
//     super()
//   }

//   connectedCallback() {
//     this.innerHTML = `
//     `

//   }
// })

// customElements.define('down-arrow', class extends HTMLElement {
//   constructor() {
//     super()
//   }
//   connectedCallback() {
//     this.innerHTML = `
// <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
// <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
// </svg>

// `
//   }

// })

// console.log('treejs loadded')



// const arrayOfItems = [
//     "Starlord",
//     "Gamora",
//     "Groot",
//     "Rocket",
//     "Drax",
//      "Yondu",
//      "Nebula",
//      "Korath",
// ]


// customElements.define('diagram-container', class extends HTMLElement {
//     constructor() {
//         super()
//     }

//     connectedCallback() {
//         this.render()
//     }
//     render() {


//         const size = 1000
//         const topHeight = size * 0.2
//         const bottomHeight = size * 0.8
//         const distance = size / arrayOfItems.length
//         const radius = topHeight * 0.5
//         const halfSize = size * 0.5

//         this.innerHTML = `
//         <style>
//         svg {
//             width: 100%;
//             height: 100%;
//           }
//           path {
//             stroke: #AE8EE9;
//             fill: none;
//             stroke-width: 4;
//             stroke-linecap: round;
//           }
//           .circle {
//             stroke-width: 5;
//             stroke: #AE8EE9;
//             fill: none;
//           }
//         </style>


// <svg viewBox="0 0 ${size} ${size}">
// <g id="root"></g>

// <defs>
// <mask id="svg-mask">
//    <circle r="${radius}" 
//            cx="${halfSize}" 
//            cy="${topHeight}" 
//            fill="white"/>
// </mask>
// </defs>

// <image mask="url(#svg-mask)" 
// x="${halfSize-radius}" 
// y="${topHeight-radius}"
// height="${topHeight}" 
// width="${topHeight}"
// xlink:href="https://s3-ap-southeast-2.amazonaws.com/kruties-diagrams/misc/guardians-of-the-galaxy.jpg">

// </image>
// </svg>
//         `
//         arrayOfItems.forEach((a, index) => {
//             // value of x2 and x3
//           const   x =Math.round( index * distance + (distance * 0.5))

//           document.getElementById('root').insertAdjacentHTML('beforeend', `<g><path d="M${size*0.5},${(size*0.2) + radius}  C${size*0.5},${size*0.5} ${x},${size*0.5} ${x},${size*0.8}"/>

//           <circle fill="#AE8EE9" r="10" cx="${x}" cy="${size*0.8}"></circle>
//           </g>`)

//         })


//     }
// })




// customElements.define('diagram-com', class extends HTMLElement {
//     constructor() {
//         super()
//     }

//     connectedCallback() {


//         const x2 = this.getAttribute('x2')


//         const x3 = this.getAttribute('x3')


//         const minX = this.getAttribute('min-x')
//         const minY = this.getAttribute('min-y')

//         const viewBoxWidth = this.getAttribute('viewbox-width')
//         const viewBoxHeight = this.getAttribute('viewbox-heigth')

//         const size = this.getAttribute('size')
//         const radius = this.getAttribute('radius')
//         const bottomHeight =this.getAttribute('bottom-height')

//         this.innerHTML = `
//         <svg viewBox="${minX} ${minY} ${viewBoxWidth} ${viewBoxHeight}">
//         <path d="M ${size*0.5}, ${(size*0.2) + radius}  
//          C ${size*0.5}, ${size*0.5}
//            ${x2}, ${size*0.5}
//            ${x3}, ${size*0.8}"
// >
//         </svg>
//         `
//     }

// })










/*
console.log('treejs loadded')



const arrayOfItems = [
    "Starlord",
    "Gamora",
    "Groot",
    "Rocket",
    "Drax",
     "Yondu",
     "Nebula",
     "Korath",
]


customElements.define('diagram-container', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.render()
    }
    render() {


        const size = 1000
        const topHeight = size * 0.2
        const bottomHeight = size * 0.8
        const distance = size / arrayOfItems.length
        const radius = topHeight * 0.5
        const halfSize = size * 0.5

        this.innerHTML = `
        <style>
        svg {
            width: 100%;
            height: 100%;
          }
          path {
            stroke: #AE8EE9;
            fill: none;
            stroke-width: 4;
            stroke-linecap: round;
          }
          .circle {
            stroke-width: 5;
            stroke: #AE8EE9;
            fill: none;
          }
        </style>


<svg viewBox="0 0 ${size} ${size}">
<g id="root"></g>

<defs>
<mask id="svg-mask">
   <circle r="${radius}"
           cx="${halfSize}"
           cy="${topHeight}"
           fill="white"/>
</mask>
</defs>

<image mask="url(#svg-mask)"
x="${halfSize-radius}"
y="${topHeight-radius}"
height="${topHeight}"
width="${topHeight}"
xlink:href="https://s3-ap-southeast-2.amazonaws.com/kruties-diagrams/misc/guardians-of-the-galaxy.jpg">

</image>
</svg>
        `
        arrayOfItems.forEach((a, index) => {
            // value of x2 and x3
          const   x =Math.round( index * distance + (distance * 0.5))

          document.getElementById('root').insertAdjacentHTML('beforeend', `<g><path d="M${size*0.5},${(size*0.2) + radius}  C${size*0.5},${size*0.5} ${x},${size*0.5} ${x},${size*0.8}"/>

          <circle fill="#AE8EE9" r="10" cx="${x}" cy="${size*0.8}"></circle>
          </g>`)

        })


    }
})




customElements.define('diagram-com', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        //const x0 = this.getAttribute('x0')
        //  const y0 = this.getAttribute('y0')

        //  const x1 = this.getAttribute('x1')
        //   const y1 = this.getAttribute('y1')

        const x2 = this.getAttribute('x2')
        //   const y2 = this.getAttribute('y2')

        const x3 = this.getAttribute('x3')
        //   const y3 = this.getAttribute('y3')

        const minX = this.getAttribute('min-x')
        const minY = this.getAttribute('min-y')

        const viewBoxWidth = this.getAttribute('viewbox-width')
        const viewBoxHeight = this.getAttribute('viewbox-heigth')

        const size = this.getAttribute('size')
        const radius = this.getAttribute('radius')
        const bottomHeight =this.getAttribute('bottom-height')

        this.innerHTML = `
        <svg viewBox="${minX} ${minY} ${viewBoxWidth} ${viewBoxHeight}">
        <path d="M ${size*0.5}, ${(size*0.2) + radius}
         C ${size*0.5}, ${size*0.5}
           ${x2}, ${size*0.5}
           ${x3}, ${size*0.8}"
>
        </svg>
        `
    }

})
*/