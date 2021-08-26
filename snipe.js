
const fetch = require('node-fetch')
var FormData = require('form-data');
const {URL} =require('url')
const idtoken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjkwMDk1YmM2ZGM2ZDY3NzkxZDdkYTFlZWIxYTU1OWEzZDViMmM0ODYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiU2VyZGFyIEFzaGlyb3YiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2lNY0N3cTVYT1RqdkNRMWRlN1RBLXNjNlRtOE9jUnhUbUZHMUo3aEE9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdHVya21lbmlzdGFuLW1hcmtldCIsImF1ZCI6InR1cmttZW5pc3Rhbi1tYXJrZXQiLCJhdXRoX3RpbWUiOjE2Mjk4ODAyNzksInVzZXJfaWQiOiJyZG5DUHh6TGVuWTdKSGhLdWlQZjgyU1pBcHcyIiwic3ViIjoicmRuQ1B4ekxlblk3SkhoS3VpUGY4MlNaQXB3MiIsImlhdCI6MTYyOTg4MDYzOSwiZXhwIjoxNjI5ODg0MjM5LCJlbWFpbCI6InRrbS5ob3VzZS5uZXdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTgzNjk1MTExMjMyMTAxMTE5OTgiXSwiZW1haWwiOlsidGttLmhvdXNlLm5ld0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.HA-FaXbYUsFXUlQC1yzrXdWB4N5DrWBE7oyt2iyBH1uP9INGMXcSpr3pHI1PW6jVnemfuUv6k6YdaMbYiYseUfiRBvcOvTDl8FWTvk9Pb9I8oGIGOFpMJxfNAchwe96d7dmt4lvbksD-mGGNO3tvmvGzeKcQdhoVPY8MRref8yIUjgd3JtNDlHdWfZUw7-_fhUdcnnmxkQUZJ0aNcxqt7SkDatgh9_T4aKzfPoVt_uJkJ9ja98KFKXzaihSqVBCadmlblBiXd7J3nG_AcPNtTybdyNtqGvApmItKLHZIeZaz4QyCYZ6chWDrl0qGgraenZvZegy37K3LSoV4hbmY6A"

//const idtoken='eyJhbGciOiJSUzI1NiIsImtpZCI6IjkwMDk1YmM2ZGM2ZDY3NzkxZDdkYTFlZWIxYTU1OWEzZDViMmM0ODYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiU2VyZGFyIEFzaGlyb3YiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2lNY0N3cTVYT1RqdkNRMWRlN1RBLXNjNlRtOE9jUnhUbUZHMUo3aEE9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdHVya21lbmlzdGFuLW1hcmtldCIsImF1ZCI6InR1cmttZW5pc3Rhbi1tYXJrZXQiLCJhdXRoX3RpbWUiOjE2Mjk4ODAyNzksInVzZXJfaWQiOiJyZG5DUHh6TGVuWTdKSGhLdWlQZjgyU1pBcHcyIiwic3ViIjoicmRuQ1B4ekxlblk3 …XRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTgzNjk1MTExMjMyMTAxMTE5OTgiXSwiZW1haWwiOlsidGttLmhvdXNlLm5ld0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.TmhTjESsoaOpSbnZXuCSLDy23NXWGUFtCsaNlnL6XgrtCxqJc6npQBMs40NFcFyZFPwshQPEWlThWx05ctFP3Tn5JVcS2PT5MuUB_fTMTOeuBI1ZF_LDJ55s5M_7rbJ4uXtkDFes-CiZMJWeXGD1-4-9tsa_M2NkiXjPFeWrqjgi1v7EBgob6i0p2Cm93s9I8odjFY-2BoEyP9M-VUUcIThxe--ugwOE0Xl42iLiLGb4otr3Nx0WyTVPUCt6mKYZeekomIOs-kUIr8hnBZGf-ZMigF_HRGk5UloIy8xDBhTSBCfzw7ycJq35Ex0GzTktQXrmnnLQU5brySbmOiJWTg'


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

firebase().setIdToken(idtoken).setProjectUri('https://turkmenistan-market.firebaseio.com').ref('rest/users').push({ fulname: 'monakod', name:"hellonamed" }, () => {
    console.log('firebase updated')
})

function refreshToken() {

    const reftoken = "ACzBnCjGeOZ7MZd1y3sHlTUN702IX1a6ZZBetu-8DXZxJ4tscWYFaoyDo7UBeinP5DB6FddsFxkNNu2DKRk7DHUGs5PBkgJ4QyWkCcMBMkNYR7U2WeYChgGi2OqeiMM2xPt3b0BF4dXRyHBkMhjDBBpTJtwaSvRmb8p-4PfSdlR-OP1kptJUf7nx9UOm1f94jXgNPkcd1kSRoQbuDG6AKV7par9HWo3kMaeaTOYxyLc0k9H0PiXZKo4uh-Wk71wuOcwNgzwocbuANUPea7iJvApTJXsBA5t1ReyIj9M_-o3x2o-Dfj_mN6DqnaF0gIhuhvJdFe1yK1imzSp1xQUixcWB2qDQODP_eZugWVJTuPhMa7WkViDlrhVCXgW4A4NxIzEv8fmvWVMyoSbJZygmrTk7ZDJ2u9dZarrfUb7pNhvp-icmHPMsYC0SM8vK4M0aHPVXBasmrhNu"


    fetch('https://securetoken.googleapis.com/v1/token?key=AIzaSyDb8Z27Ut0WJ-RH7Exi454Bpit9lbARJeA', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body:`grant_type=refresh_token&refresh_token=${reftoken}` }).then(async response => {
        debugger;
        const status = response.status
        const text = await response.json()
        debugger;
    }).catch(error => {
        debugger;
    })
}


//refreshToken()