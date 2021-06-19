customElements.define('scraping-result', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        this.innerHTML=`<div class="row border shadow-sm mt-2">

        <table-column class="col" colname='File Name' coldata="books.json">
        
        </table-column>

        <table-column class="col" colname='Username' coldata="test@gmail.com">
        
        </table-column>
        
        <table-column class="col" colname='Duration' coldata="15 minutes">
        
        </table-column>
        <table-column class="col" colname='Date' coldata="10.10.2021">
    
        </table-column>
        <download-button class="col" title='Excel' >
    
        </download-button>
        </div>`
    }
})


customElements.define('table-column', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        const columnName =this.getAttribute('colname')
        const columnData =this.getAttribute('coldata')
        this.innerHTML=`<div class="row">
            <div class="col-12 border-start border-bottom p-2 bg-light fw-normal">${columnName}</div>
            <div class="col-12 border-start  p-2 fw-light">${columnData}</div>
        </div>`
    }
})


customElements.define('download-button', class extends HTMLElement{
    constructor(){
        super()
    }
    connectedCallback(){
      
        const btnTitle =this.getAttribute('title')
        this.innerHTML=`
        <div class="row">
            <div class="col-12 border-start border-bottom p-2 bg-light fw-normal">Download</div>
            <div class="col-12 border-start  p-2 fw-light btn btn-link text-start">${btnTitle}</div>
        </div>
        `
    }
})