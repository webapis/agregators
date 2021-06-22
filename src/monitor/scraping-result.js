customElements.define('scraping-result', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        const date =this.getAttribute('date')
        const uploadPathXlsx =this.getAttribute('upload-path-xlsx')
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
        <download-button class="col" title='Excel' downloadpath=${uploadPathXlsx}>
    
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
        const ext =downloadpath.substring(downloadpath.lastIndexOf('.'))
        this.innerHTML=`
        <div class="row">
            <div class="col-12 border-start border-bottom p-2 bg-light fw-normal">Download</div>
            <a class="col-12 border-start  p-2 fw-light btn btn-link text-start" id =${downloadpath} href="#" />Excell</a>
        </div>
        `
        document.getElementById(downloadpath).addEventListener('click',function (){
            downloadFile({downloadpath})
        })
    }
})





function downloadFile ({downloadpath}){
    var storage = firebase.storage()
    var pathReference = storage.ref(downloadpath).getDownloadURL().then(url=>{

        var a = document.createElement('a');
                    a.href = url;
                    a.download = "filename.xlsx";
                    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                    a.click();    
                    a.remove();  //afterwards we remove the element again    
        console.log('url', url)
    })
  
    debugger;
//     const ext =downloadpath.substring(downloadpath.lastIndexOf('.'))
//     var storageRef = firebase.storage().ref()
//     debugger;
//     storageRef.child(downloadpath).getDownloadURL()
//   .then((url) => {
//     console.log('excel url',url)
//     fetch(url, {
//         method: 'GET',
//         headers: new Headers({
//             'Access-Control-Allow-Origin':'*'
//         })
//     })
//     .then(response => response.blob())
//     .then(blob => {
//             var url = window.URL.createObjectURL(blob);
//             var a = document.createElement('a');
//             a.href = url;
//             a.download = "filename.xlsx";
//             document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
//             a.click();    
//             a.remove();  //afterwards we remove the element again         
            
//     });
    
//   })
//   .catch((error) => {
//     // Handle any errors
//   });
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