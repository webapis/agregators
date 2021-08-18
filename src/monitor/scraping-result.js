customElements.define('scraping-result', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        const start = new Date (parseInt(this.getAttribute('start')))
        const end =new Date(parseInt(this.getAttribute('end')))
        const duration = window.diff(start,end)
        
        const uploadPathXlsx =this.getAttribute('upload-path-xlsx')
        
        this.innerHTML=`<div class="row border shadow-sm mt-2">

        <table-column class="col" colname='Username' coldata="test@gmail.com">
        
        </table-column>
        <table-column class="col" colname='Started' coldata="${start}">
    
        </table-column>
        <table-column class="col" colname='Ended' coldata="${end}">
    
        </table-column>
        <table-column class="col" colname='Duration' coldata="${duration}">
        
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
            <div class="col-12 border-start  p-2 fw-light" >${columnData}</div>
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
           window.downloadFile({downloadpath})
        })
    }
})





// function downloadFile ({downloadpath}){
//     var storage = firebase.storage()
//     var pathReference = storage.ref(downloadpath).getDownloadURL().then(url=>{

//         var a = document.createElement('a');
//                     a.href = url;
//                     a.download = "filename.xlsx";
//                     document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
//                     a.click();    
//                     a.remove();  //afterwards we remove the element again    
//         console.log('url', url)
//     })
// }

// function diff(t1, t2) {
//    // const t1 = new Date(1579876543210) // your initial time
// //const t2 = new Date(1579987654321) // your later time
    
//     const diff = t2-t1
//     const SEC = 1000, MIN = 60 * SEC, HRS = 60 * MIN
// return  `${Math.floor(diff/HRS)}:${Math.floor((diff%HRS)/MIN).toLocaleString('en-US', {minimumIntegerDigits: 2})}:${Math.floor((diff%MIN)/SEC).toLocaleString('en-US', {minimumIntegerDigits: 2})}`
    
// }

/*

function downloadFile ({downloadpath}){
    var storageRef = firebase.storage().ref()
    
    storageRef.child(downloadpath).getDownloadURL()
  .then((url) => {
      
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
    
    img.setAttribute('src', url);
  })
  .catch((error) => {
    // Handle any errors
  });
}
*/