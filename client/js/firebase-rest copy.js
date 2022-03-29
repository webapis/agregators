
function firebase() {
    this.url = ''
    this.idToken = '',
        this.projectUri = '',
        this.orderByValue = '',
        this.equalToValue = '',
        this.limitToLastValue = 0,
        this.limitToFirstValue=0

    return {
        setIdToken: function (idToken) {
            this.idToken = idToken
            
            return this
        },
        setProjectUri: function (projectUri) {
            this.projectUri = projectUri
            return this
        },
        ref: function (url) {
            this.url = url
            return   this
        },
        set: async function (data, cb) {
            await updateIdToken()
            fetch(`${this.projectUri}/${this.url}/.json?auth=${this.idToken}`, { method: 'PUT', body: JSON.stringify(data) }).then(response => response.json()).then(data => {
                cb && cb(null,data)
            }).catch(error => {
                cb && cb(error,null)
                return this
            })

        },
        update: async function (data, cb) {
            try {
                await updateIdToken()
                const fetchUrl =this.url ==='/'? `${this.projectUri}/.json?auth=${this.idToken}`: `${this.projectUri}/${this.url}.json?auth=${this.idToken}`
                
                const updateResponse = await fetch(fetchUrl, { method: 'PATCH', body: JSON.stringify(data) })
                const updateJsonData = await updateResponse.json()
                const error =updateJsonData['error']
                if(error){
                    
                    window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: error })
                    cb && cb(error,null)  
                } else{
                    cb && cb(null,updateJsonData)
                }
     
            } catch (error) {
                throw error
             //   const {message}=error
               // window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: message })
            }
          
         
        },
        
        push: async function (data, cb) {
            try {
                await updateIdToken()
                const fetchUrl =this.url ==='/'? `${this.projectUri}/.json?auth=${this.idToken}`: `${this.projectUri}/${this.url}.json?auth=${this.idToken}`
                
                const updateResponse = await fetch(fetchUrl, { method: 'POST', body: JSON.stringify(data) })
                const updateJsonData = await updateResponse.json()
                const error =updateJsonData['error']
                if(error){
                    
                    window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: error })
                    cb && cb(error,null)  
                } else{
                    cb && cb(null,updateJsonData)
                }
     
            } catch (error) {
                const {message}=error
                window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: message })
            }
        },
        get: async function (cb) {
            try {
                await updateIdToken()
                
                const fetchUrl =this.url ==='/'? `${this.projectUri}/.json?auth=${this.idToken}`: `${this.projectUri}/${this.url}.json?auth=${this.idToken}`
                const getResponse =await   fetch(fetchUrl, { method: 'GET'})
                const getJsonData =await getResponse.json()
 
                 
                 const error =getJsonData&&  getJsonData['error']
                 
                 if(error){
                     
                 
                     cb && cb(error,null) 
                     
                 } else{
                     
                     cb && cb(null,getJsonData)
                 }
            } catch (error) {
              // const {message}=error
            
          
                throw error
                //cb && cb(error,null) 
            }
        },
        remove: async function (cb) {
            try {
                await updateIdToken()
                const fetchUrl =this.url ==='/'? `${this.projectUri}/.json?auth=${this.idToken}`: `${this.projectUri}/${this.url}.json?auth=${this.idToken}`
              const getResponse =await   fetch(fetchUrl, { method: 'DELETE'})
              const getJsonData =await getResponse.json()
 
                 
                 const error =getJsonData&&  getJsonData['error']
                 
                 if(error){
                     
                  //   window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: error })
                     cb && cb(error,null) 
                     
                 } else{
                     
                     cb && cb(null,getJsonData)
                 }
            } catch (error) {
               const {message}=error
               // window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: message })
                cb && cb(error,null) 
            }
        },
        
        filter: async function (cb) {
            try {
                await updateIdToken()
                const fetchUrl =this.url ==='/'? `${this.projectUri}/.json?auth=${this.idToken}`: `${this.projectUri}/${this.url}.json?auth=${this.idToken}&orderBy="${this.orderByValue}"&limitToFirst=${this.limitToFirstValue}`
                
              const getResponse =await   fetch(fetchUrl, { method: 'GET'})
              const getJsonData =await getResponse.json()
 
                 
                 const error =getJsonData&&  getJsonData['error']
                 
                 if(error){
                     
                     window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: error })
                     cb && cb(error,null) 
                     
                 } else{
                     
                     cb && cb(null,getJsonData)
                 }
            } catch (error) {
               const {message}=error
                window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: message })
                cb && cb(error,null) 
            }
        },
        on: async function (event, cb) {
            
            await updateIdToken()
            switch (event) {
                case "value":
                    const fetchUrl =this.url ==='/'? `${this.projectUri}/.json?auth=${this.idToken}`: `${this.projectUri}/${this.url}.json?auth=${this.idToken}`
                        
                    var childaddedEvent = new EventSource(fetchUrl, {});
                    childaddedEvent.onerror = function (error) {
                       
                        cb(error, null)
                    };
                    childaddedEvent.addEventListener('put', function (e) {
                        
                        const response =JSON.parse(e.data)
                 
                        cb(null, response)
                        console.log(e.data)
                    })
                    break;
                default:
                    ""
            }

        },
        once: async function (cb) {
            await updateIdToken()
            const fetchPath = `${this.projectUri}/${this.url}.json?auth=${this.idToken}`

            fetch(fetchPath).then(response => response.json()).then(data => {

                cb && cb(data)
            }).catch(error => {

                cb && cb(error, data)
                return this
            })
        },
        orderBy: function (orderByValue) {
            this.orderByValue = orderByValue
            return this
        },
        equalTo: function (equalToValue) {
            this.equalToValue = equalToValue
            return this
        },
        limitToLast: function (limitToLastValue) {
            this.limitToLastValue = limitToLastValue
            return this
        },
        limitToFirst: function (limitToFirstValue) {
            this.limitToFirstValue = limitToFirstValue
            return this
        },
    }
}
async function renewIdToken({ api_key, refreshToken }) {
    
    const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${api_key}`, { method: 'post', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=refresh_token&refresh_token=${refreshToken}` })
               
    const data = await response.json()
    return data
}

async function updateIdToken() {
    const auth = JSON.parse(localStorage.getItem('auth'))
    if (auth) {
        const { timestamp, api_key, refreshToken }  = auth
    
        if (Date.now() > timestamp) {
            const { id_token } = await renewIdToken({ api_key, refreshToken })
            JSON.stringify({...auth,idToken:id_token,timestamp: Date.now() + 3600000})

        }

    }
}

window.renewIdToken = renewIdToken
window.updateIdToken=updateIdToken
window.firebase = firebase



/*
fetch(fetchUrl).then(async response => {

    const status = response.status
    const statusText = response.statusText
    if (status === 401 && statusText === 'Unauthorized') {
        
        const data = await response.json()
        const error = data['error']
        if (error && error === 'Auth token is expired') {
            
          const response =  await renewIdToken({api_key:'AIzaSyCM7LDPIq6eelnMH_A8SARtIBDT5Zi5tK8',refresh_token:`AIwUaOkRflq115BKDTTt8V7xjnrxEiTwuUrkz6hjHAHJBOrYnXsOKtrbxQssDrYvHGOSujdDFGXiP0adeIfqasdAlhFj4c7a44jE7grP0RPMDDFH8TnmgAgfchrqB7-ewR9oZFdmx3kYQhT0AELG4T2DYKV5L_Te7cgZDM491tuLqF71t8c0ZcnBXhDVQKQAyliYWj0HAaoB0Fj22qMYINnl6dm6Yb1FAjgc_AUJxdipAEICNp6kMeAGkQae5T0zTfPB5tZU4fHXEvjjYi7h_w_JtTMTfFT1Mj2mmVYlkOJ0wZXRtsxtt5cnoPS0WscMMQ8w-GqFxm-r71aZ7t9N5pcZMHClcr2aBA`})
            

            
        } else {
            
            throw 'Unhandled firebase auth error'
        }

        
    } else {
        return response.json()
    }
    


}).then(async workflows => {
    
}).catch((error) => {
    
})
*/