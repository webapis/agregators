
document.head.insertAdjacentHTML('beforeend','<link href="/css/bootstrap/bootstrap.min.css" rel="stylesheet">  <link href="/css/breadcrumb.css" rel="stylesheet">')

export default async () => {
  
   await Promise.all([

        import('./firebase-rest.js'),
        import('../components/signed-in-as.js'),
        import('../components/error-displayer.js'),
        import('../css/bootstrap/bootstrap.min.js')
    ])

    window.projectUrl =window.location.hostname==='localhost'?'http://localhost:9000':'https://workflow-prod-799d4-default-rtdb.firebaseio.com'
    window.webapikey=window.location.hostname==='localhost'?'AIzaSyDb8Z27Ut0WJ-RH7Exi454Bpit9lbARJeA':'AIzaSyCM7LDPIq6eelnMH_A8SARtIBDT5Zi5tK8'


    if(!document.querySelector('signed-in-as')){
        document.body.insertAdjacentHTML('afterbegin',`<signed-in-as></signed-in-as>`)
    }
   
    if(!document.querySelector('error-displayer')){
      
    }
}




