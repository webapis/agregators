
document.head.insertAdjacentHTML('beforeend', '<link href="/css/bootstrap/bootstrap.min.css" rel="stylesheet">  <link href="/css/breadcrumb.css" rel="stylesheet">')

export default async () => {

    await Promise.all([

        import('./firebase-rest.js'),
        import('../components/signed-in-as.js'),
        import('../components/error-displayer.js'),
        import('../css/bootstrap/bootstrap.min.js'),
        import('../components/bootstrap-icons.js')


    ])
    await updateIdToken()
    window.projectUrl = window.location.hostname === 'localhost' ? 'http://localhost:9000' : 'https://workflow-prod-799d4-default-rtdb.firebaseio.com'
    window.webapikey = window.location.hostname === 'localhost' ? 'AIzaSyDb8Z27Ut0WJ-RH7Exi454Bpit9lbARJeA' : 'AIzaSyCM7LDPIq6eelnMH_A8SARtIBDT5Zi5tK8'

    //
    if (!document.querySelector('signed-in-as')) {
        document.body.insertAdjacentHTML('afterbegin', `<signed-in-as></signed-in-as>`)
    }

    if (!document.querySelector('error-displayer')) {

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
        const { timestamp, api_key, refreshToken } = auth

        if (Date.now() > timestamp) {
            const { id_token } = await renewIdToken({ api_key, refreshToken })
            JSON.stringify({ ...auth, idToken: id_token, timestamp: Date.now() + 3600000 })

        }

    }
}

// window.renewIdToken = renewIdToken
// window.updateIdToken = updateIdToken
