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
  

        const x2 = this.getAttribute('x2')
      

        const x3 = this.getAttribute('x3')
       

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