customElements.define('head-setter',class extends HTMLElement{
    constructor(){
        super()
    }
    connectedCallback() {

    this.childNodes.forEach((node,i)=>{
        if(i<= this.childNodes.length){
            console.log('w',i,this.childNodes.length )
            document.head.appendChild(node.cloneNode(true))
        }
         if ((i+1) === this.childNodes.length){
            console.log(i,this.childNodes.length)
            this.outerHTML=''
        }
    })
   
  
    }

}) 