
const fetch = require('node-fetch')
var FormData = require('form-data');
const {URL} =require('url')


function firebase() {
    this.url = ''
    this.idToken = '',
        this.projectUri = ''
    debugger;
    return {
        setIdToken: function (idToken) {
            this.idToken = idToken
            debugger;
            return this
        },
        setProjectUri: function (projectUri) {
            this.projectUri = projectUri
            debugger;
            return this
        },
        ref: function (url) {
            this.url = url
            return this
        },
        set: function (data, cb) {
            debugger;
            debugger;
            fetch(`${this.projectUri}/${this.url}/.json?auth=${this.idToken}`, { method: 'put', body: JSON.stringify(data) }).then(response => response.json()).then(data => {
                debugger;
                cb && cb()
            }).catch(error => {
                debugger;
                cb && cb(error)
                return this
            })

        },
        update: function (data, cb) {
            fetch(`${this.projectUri}/${this.url}/.json?auth=${this.idToken}`, { method: 'patch', body: JSON.stringify(data) }).then(response => response.json()).then(data => {
                debugger;
                cb && cb()
            }).catch(error => {
                debugger;
                cb && cb(error)
                return this
            })
        },
        push: function (data, cb) {
            const urlss= new URL(`${this.projectUri}/${this.url}/.json`)
          
            urlss.searchParams.append('auth',this.idToken)
            const href =urlss.href
            debugger;
            fetch(href, { method: 'post', body: JSON.stringify(data) }).then(response => response.json()).then(data => {
                debugger;
                cb && cb()
            }).catch(error => {
                debugger;
                cb && cb(error)
                debugger;
                return this
            })
        },
        get: function (type) {

        }
    }
}

// firebase().setIdToken(idtoken).ref('https://turkmenistan-market.firebaseio.com/rest/users').set({ name: 'meross', fulname: 'baderos' }, () => {
//     console.log('firebase updated')
// })

// firebase().setIdToken(idtoken).ref('https://turkmenistan-market.firebaseio.com/rest/users').update({ fulname: 'monako' }, () => {
//     console.log('firebase updated')
// })

// firebase().setIdToken(idtoken).setProjectUri('https://turkmenistan-market.firebaseio.com').ref('rest/users').push({ fulname: 'monakod', name:"hellonamed" }, () => {
//     console.log('firebase updated')
// })




//refreshToken()