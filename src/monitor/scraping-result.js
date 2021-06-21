customElements.define('scraping-result', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        const date =this.getAttribute('date')
        const uploadPath =this.getAttribute('upload-path')
        debugger;
        this.innerHTML=`<div class="row border shadow-sm mt-2">

        <table-column class="col" colname='File Name' coldata="books.json">
        
        </table-column>

        <table-column class="col" colname='Username' coldata="test@gmail.com">
        
        </table-column>
        
        <table-column class="col" colname='Duration' coldata="15 minutes">
        
        </table-column>
        <table-column class="col" colname='Date' coldata="${date}">
    
        </table-column>
        <download-button class="col" title='Excel' downloadpath=${uploadPath}>
    
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
            <a class="col-12 border-start  p-2 fw-light" href="#" download>${columnData}</a>
        </div>`
    }
})


customElements.define('download-button', class extends HTMLElement{
    constructor(){
        super()
    }
    connectedCallback(){
      
        const btnTitle =this.getAttribute('title')
        const downloadpath =this.getAttribute('downloadpath')
        this.innerHTML=`
        <div class="row">
            <div class="col-12 border-start border-bottom p-2 bg-light fw-normal">Download</div>
            <a class="col-12 border-start  p-2 fw-light btn btn-link text-start" id =${downloadpath} href="#" download='books.json'/>Excell</a>
        </div>
        `
        document.getElementById(downloadpath).addEventListener('click',()=>{
            downloadFile({downloadpath})
        })
    }
})





function downloadFile ({downloadpath}){
    var storageRef = firebase.storage().ref()
    debugger;
    storageRef.child(downloadpath).getDownloadURL()
  .then((url) => {

    fetch("http://example.com/ExportExcel", {
        method: 'GET',
        headers: new Headers({
            'Access-Control-Allow-Origin':'*'
        })
    })
    .then(response => response.blob())
    .then(blob => {
        var url = window.URL.createObjectURL(blob);
        var a = document.getElementById(downloadpath);
        a.download = "books.json";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();    
        a.remove();  //afterwards we remove the element again         
    });
    
  })
  .catch((error) => {
    // Handle any errors
  });
}


/*

function downloadFile ({downloadpath}){
    var storageRef = firebase.storage().ref()
    debugger;
    storageRef.child(downloadpath).getDownloadURL()
  .then((url) => {
      debugger
      console.log('url',url)
    // `url` is the download URL for 'images/stars.jpg'

    // This can be downloaded directly:
    var xhr = new XMLHttpRequest();
    xhr.setRequestHeader('Access-Control-Allow-Origin','*')
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      var blob = xhr.response;
      console.log('blob',blob)
    };
    xhr.open('GET', url);
    xhr.send();

    // Or inserted into an <img> element
    var img = document.getElementById(downloadpath);
    debugger;
    img.setAttribute('src', url);
  })
  .catch((error) => {
    // Handle any errors
  });
}
*/