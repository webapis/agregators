function diff(t1, t2) {
    // const t1 = new Date(1579876543210) // your initial time
 //const t2 = new Date(1579987654321) // your later time
     
     const diff = t2-t1
     const SEC = 1000, MIN = 60 * SEC, HRS = 60 * MIN
 return  `${Math.floor(diff/HRS)}:${Math.floor((diff%HRS)/MIN).toLocaleString('en-US', {minimumIntegerDigits: 2})}:${Math.floor((diff%MIN)/SEC).toLocaleString('en-US', {minimumIntegerDigits: 2})}`
     
 }



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
}


export {diff,downloadFile}