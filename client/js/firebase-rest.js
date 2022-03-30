
function firebase() {
    this.url = ''
    this.idToken = '',
        this.projectUri = '',
        this.orderByValue = '',
        this.equalToValue = '',
        this.limitToLastValue = 0,
        this.limitToFirstValue = 0

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
            return this
        },
        set: async function (data) {
            const { idToken, refreshToken, api_key,localId } = JSON.parse(localStorage.getItem('auth'))
            const fetchUrl = this.url === '/' ? `${window.projectUrl}/.json?auth=${idToken}` : `${window.projectUrl}/${this.url}.json?auth=${idToken}`
            const response = await fetch(fetchUrl, { method: 'PUT', body: JSON.stringify(data) })
            const status = response.status
            const statusText = response.statusText
            
            if (status === 401 && statusText === 'Unauthorized') {
                
                const data = await response.json()
                const error = data['error']
                if (error && error === 'Auth token is expired') {
                    
                    await renewIdToken({ api_key, refresh_token: refreshToken,localId })
                    let { idToken:refreshedIdToken } = JSON.parse(localStorage.getItem('auth'))
                    const fetchUrl2 = this.url === '/' ? `${window.projectUrl}/.json?auth=${refreshedIdToken}` : `${window.projectUrl}/${this.url}.json?auth=${refreshedIdToken}`
                    const response =  await fetch(fetchUrl2, { method: 'PUT', body: JSON.stringify(data) })
                    const data = await response.json()
                    
                    return data
                } else {
                    
                    throw 'Unhandled firebase auth error'
                }
            } else {
                const data = await response.json()
                return data
            }

        },
        update: async function (data) {
            const { idToken, refreshToken, api_key,localId } = JSON.parse(localStorage.getItem('auth'))
            const fetchUrl = this.url === '/' ? `${window.projectUrl}/.json?auth=${idToken}` : `${window.projectUrl}/${this.url}.json?auth=${idToken}`
            debugger;
            const response = await fetch(fetchUrl, { method: 'PATCH', body: JSON.stringify(data) })
            debugger;
            const status = response.status
            const statusText = response.statusText
            
            if (status === 401 && statusText === 'Unauthorized') {
                
                const data = await response.json()
                const error = data['error']
                if (error && error === 'Auth token is expired') {
                    
                    await renewIdToken({ api_key, refresh_token: refreshToken,localId })
                    let { idToken:refreshedIdToken } = JSON.parse(localStorage.getItem('auth'))
                    const fetchUrl2 = this.url === '/' ? `${window.projectUrl}/.json?auth=${refreshedIdToken}` : `${window.projectUrl}/${this.url}.json?auth=${refreshedIdToken}`
                    const response =  await fetch(fetchUrl2, { method: 'PATCH', body: JSON.stringify(data) })
                    const data = await response.json()
                    
                    return data
                } else {
                    
                    throw 'Unhandled firebase auth error'
                }
            } else {
                const data = await response.json()
                return data
            }

        },

        push: async function (data) {
            const { idToken, refreshToken, api_key,localId } = JSON.parse(localStorage.getItem('auth'))
            const fetchUrl = this.url === '/' ? `${window.projectUrl}/.json?auth=${idToken}` : `${window.projectUrl}/${this.url}.json?auth=${idToken}`
            const response = await fetch(fetchUrl, { method: 'POST', body: JSON.stringify(data) })
            const status = response.status
            const statusText = response.statusText
            
            if (status === 401 && statusText === 'Unauthorized') {
                
                const data = await response.json()
                const error = data['error']
                if (error && error === 'Auth token is expired') {
                    
                    await renewIdToken({ api_key, refresh_token: refreshToken,localId })
                    let { idToken:refreshedIdToken } = JSON.parse(localStorage.getItem('auth'))
                    const fetchUrl2 = this.url === '/' ? `${window.projectUrl}/.json?auth=${refreshedIdToken}` : `${window.projectUrl}/${this.url}.json?auth=${refreshedIdToken}`
                    const response =  await fetch(fetchUrl2, { method: 'POST', body: JSON.stringify(data) })
                    const data = await response.json()
                    
                    return data
                } else {
                    
                    throw 'Unhandled firebase auth error'
                }
            } else {
                const data = await response.json()
                return data
            }

        },
        get: async function () {
            let { idToken, refreshToken, api_key,localId } = JSON.parse(localStorage.getItem('auth'))
            const fetchUrl = this.url === '/' ? `${window.projectUrl}/.json?auth=${idToken}` : `${window.projectUrl}/${this.url}.json?auth=${idToken}`
            const response = await fetch(fetchUrl, { method: 'GET' })
            const status = response.status
            const statusText = response.statusText
            if (status === 401 && statusText === 'Unauthorized') {
                
                const data = await response.json()
                const error = data['error']
                if (error && error === 'Auth token is expired') {
                    
                    await renewIdToken({ api_key, refresh_token: refreshToken,localId })
                    let { idToken:refreshedIdToken } = JSON.parse(localStorage.getItem('auth'))
                    const fetchUrl2 = this.url === '/' ? `${window.projectUrl}/.json?auth=${refreshedIdToken}` : `${window.projectUrl}/${this.url}.json?auth=${refreshedIdToken}`
                    const response = await fetch(fetchUrl2, { method: 'GET' })
                    const data = await response.json()
                    
                    return data
                } else {
                    
                    throw 'Unhandled firebase auth error'
                }
            } else {
                const data = await response.json()
                return data
            }
        },
        remove: async function () {
            const { idToken, refreshToken, api_key,localId } = JSON.parse(localStorage.getItem('auth'))
            const fetchUrl = this.url === '/' ? `${window.projectUrl}/.json?auth=${idToken}` : `${window.projectUrl}/${this.url}.json?auth=${idToken}`
            const response = await fetch(fetchUrl, { method: 'DELETE'})
            const status = response.status
            const statusText = response.statusText
            debugger;
            if (status === 401 && statusText === 'Unauthorized') {
                debugger;
                const data = await response.json()
                const error = data['error']
                if (error && error === 'Auth token is expired') {
                    
                    await renewIdToken({ api_key, refresh_token: refreshToken,localId })
                    let { idToken:refreshedIdToken } = JSON.parse(localStorage.getItem('auth'))
                    const fetchUrl2 = this.url === '/' ? `${window.projectUrl}/.json?auth=${refreshedIdToken}` : `${window.projectUrl}/${this.url}.json?auth=${refreshedIdToken}`
                    const response =  await fetch(fetchUrl2, { method: 'DELETE' })
                    const data = await response.json()
                    debugger;
                    return data
                } else {
                    debugger;
                    throw 'Unhandled firebase auth error'
                }
            } else {
                const data = await response.json()
                return data
            }

        },

        filter: async function (cb) {
            try {
                await updateIdToken()
                const fetchUrl = this.url === '/' ? `${this.projectUri}/.json?auth=${this.idToken}` : `${this.projectUri}/${this.url}.json?auth=${this.idToken}&orderBy="${this.orderByValue}"&limitToFirst=${this.limitToFirstValue}`

                const getResponse = await fetch(fetchUrl, { method: 'GET' })
                const getJsonData = await getResponse.json()


                const error = getJsonData && getJsonData['error']

                if (error) {

                    window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: error })
                    cb && cb(error, null)

                } else {

                    cb && cb(null, getJsonData)
                }
            } catch (error) {
                const { message } = error
                window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: message })
                cb && cb(error, null)
            }
        },
        on: async function (event, cb) {
            switch (event) {
                case "value":
                    const fetchUrl = this.url === '/' ? `${this.projectUri}/.json?auth=${this.idToken}` : `${this.projectUri}/${this.url}.json?auth=${this.idToken}`
                    var childaddedEvent = new EventSource(fetchUrl, {});
                    childaddedEvent.onerror = function (error) {
                        cb(error, null)
                    };
                    childaddedEvent.addEventListener('put', function (e) {
                        const response = JSON.parse(e.data)
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
async function renewIdToken({ api_key, refresh_token, localId }) {

    const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${api_key}`, { method: 'post', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=refresh_token&refresh_token=${refresh_token}` })

    const { id_token, refresh_token:newRefreshToken } = await response.json()
    //update firebase
    const fetchUrl = `${window.projectUrl}/.json?auth=${id_token}`
    const responses = await fetch(fetchUrl, { method: 'PATCH', body: JSON.stringify({ [`oauth/users/${localId}/firebase/idToken`]: id_token, [`oauth/users/${localId}/firebase/refreshToken`]: newRefreshToken ,[`oauth/users/${localId}/firebase/date`]: new Date() }) })

    
    //update localstorage
    const auth = JSON.parse(localStorage.getItem('auth'))
    localStorage.setItem('auth', JSON.stringify({ ...auth, refreshToken: newRefreshToken, idToken: id_token }))
    
  
}


window.firebase = firebase



