
function firebase() {
    this.url = ''
    this.idToken = '',
        this.projectUri = '',
        this.orderByChildValue = '',
        this.equalToValue = '',
        this.limitToLastValue = 0

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
        set: async function (data, cb) {
            await updateIdToken()
            fetch(`${this.projectUri}/${this.url}/.json?auth=${this.idToken}`, { method: 'put', body: JSON.stringify(data) }).then(response => response.json()).then(data => {
                cb && cb()
            }).catch(error => {
                cb && cb(error)
                return this
            })

        },
        update: async function (data, cb) {
            await updateIdToken()
            fetch(`${this.projectUri}/${this.url}/.json?auth=${this.idToken}`, { method: 'patch', body: JSON.stringify(data) }).then(response => response.json()).then(data => {
                cb && cb()
            }).catch(error => {
                cb && cb(error)
                return this
            })
        },
        push: async function (data, cb) {
            await updateIdToken()
            fetch(`${this.projectUri}/${this.url}/.json?auth=${this.idToken}`, { method: 'post', body: JSON.stringify(data) }).then(response => response.json()).then(data => {
                cb && cb()
            }).catch(error => {
                cb && cb(error)
                return this
            })
        },
        on: async function (event, cb) {
            await updateIdToken()
            switch (event) {
                case "value":
                    const fetchPath = `${this.projectUri}/${this.url}.json?auth=${this.idToken}`
                    
                    var childaddedEvent = new EventSource(fetchPath, {});
                    childaddedEvent.onerror = function (error) {
                        cb(error, null)
                    };
                    childaddedEvent.addEventListener('put', function (e) {
                        cb(null, e)
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
        orderByChild: function (orderByChildValue) {
            this.orderByChildValue = orderByChildValue
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
    }
}
async function renewIdToken({ api_key, refreshToken }) {
    const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${api_key}`, { method: 'post', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=refresh_token&refresh_token=${refreshToken}` })
    const data = await response.json()
    return data
}

async function updateIdToken() {

    if (window.pageStore.state.auth) {
        const { auth: { timestamp, api_key, refreshToken } } = window.pageStore.state
    
        if (Date.now() > timestamp) {
            const { id_token } = await renewIdToken({ api_key, refreshToken })
          
            window.pageStore.dispatch({ type: window.actionTypes.ID_TOKEN_UPDATED, payload: { idToken: id_token } })
        }

    }
}

window.renewIdToken = renewIdToken

window.firebase = firebase