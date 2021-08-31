const fetch = require('node-fetch')

function fbRest() {
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
        set: function (data, cb) {
            
            
            fetch(`${this.projectUri}/${this.url}/.json?auth=${this.idToken}`, { method: 'put', body: JSON.stringify(data) }).then(response => response.json()).then(data => {
                
                cb && cb()
            }).catch(error => {
                
                cb && cb(error)
                return this
            })

        },
        update: function (data, cb) {
            fetch(`${this.projectUri}/${this.url}/.json?auth=${this.idToken}`, { method: 'patch', body: JSON.stringify(data) }).then(response => response.json()).then(data => {
                
                cb && cb()
            }).catch(error => {
                
                cb && cb(error)
                return this
            })
        },
        push: function (data, cb) {
            fetch(`${this.projectUri}/${this.url}/.json?auth=${this.idToken}`, { method: 'post', body: JSON.stringify(data) }).then(response => response.json()).then(data => {
                
                cb && cb()
            }).catch(error => {
                
                cb && cb(error)
                return this
            })
        },
        once: function ( cb) {
            const fetchPath = `${this.projectUri}/${this.url}.json?auth=${this.idToken}`
            //`${this.projectUri}/${this.url}.json?&orderBy=\"${this.orderByChildValue}\"&auth=${this.idToken}&equalTo=\"${this.equalToValue}\"&limitToLast=${this.limitToLastValue}`
            fetch(fetchPath).then(response => response.json()).then(data => {
           
              // const mapped = Object.entries(data).map((m) => { return { val: () => m[1], key: m[0] } })
                cb && cb(data)
            }).catch(error => {
                
                cb && cb({ error })
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
//   const userRef = fbDatabase.ref('users').orderByChild('email').equalTo(email).limitToLast(1)
async function renewIdToken({ api_key, refresh_token }) {
    const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${api_key}`, { method: 'post', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=refresh_token&refresh_token=${refresh_token}` })
    const data = await response.json()
    return data
}
module.exports = { fbRest, renewIdToken }