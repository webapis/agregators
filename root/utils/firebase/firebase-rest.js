const fetch = require('node-fetch')
const EventSource = require('eventsource')
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
        ref:  function(url) {
            
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
        update: async function (data, cb) {
         
            debugger;
            fetch(`${this.projectUri}/${this.url}/.json?auth=${this.idToken}`, { method: 'PATCH', body: JSON.stringify(data) }).then(response => response.json()).then(data => {
                cb && cb(null,data)
            }).catch(error => {
                cb && cb(error,null)
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
        on:  function(event, cb) {
            
            switch (event) {
                case "value":
                    const fetchPath = `${this.projectUri}/${this.url}.json?auth=${this.idToken}`
                    
                    var childaddedEvent = new EventSource(fetchPath, {});
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
        once: function (type, cb) {
            
            const fetchPath = `${this.projectUri}/${this.url}.json?auth=${this.idToken}`

            fetch(fetchPath).then(response => response.json()).then(data => {
         
                cb && cb(null,data)
            }).catch(error => {
                
                cb && cb(error,null )
                return this
            })},
        orderByChild: function (orderByChildValue) {
            this.orderByChildValue = orderByChildValue
            return this
        },
        orderByKey: function (orderByKeyValue) {
            this.orderByChildValue = orderByKeyValue
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

async function renewIdToken({ api_key, refresh_token }) {
    const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${api_key}`, { method: 'post', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=refresh_token&refresh_token=${refresh_token}` })
    const data = await response.json()
    return data
}
module.exports = { fbRest, renewIdToken }