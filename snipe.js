const fetch =require('node-fetch')


fetch('https://github.com/login/device/code?client_id=da589515a4265ee07cc7',{method:'post',headers:{'Accept': 'application/json'}}).then(response=>{
    debugger;
    const status =response.status
    const contentType =response.headers
    debugger;
    return response.json()
}).then(data=>{
    debugger;
}).catch((error)=>{
    debugger;
})
