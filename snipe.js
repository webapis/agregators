const fetch =require('node-fetch')
async function getNewToken(){
    try {
        
debugger;   
const response =await fetch('https://oauth2.googleapis.com/token?client_id=117708549296-br18prm8j4av8ali0d0d6r20n9bq26r2.apps.googleusercontent.com&client_secret=R1gZQlFQksbgfTnjXaLYnxUI&grant_type=refresh_token&refresh_token=ACzBnChig7a4xwVUQ4HrazS0bU2QDXFdBDz9Vr4rpCpLlhm7KxrZunr0joyjt6RpjOM_ShbIml5lUZ8HPktnTnUIGt-ClVRIR1eyOrji9jdRLIbU1gAM7h3RsratERHtDjCIOO1Y20Lx0T6-9gZU3kdE-GRVXQmJ6PAjq8TwgtELHicHTZXSdywqYweIT6PiNHuibLRpDF6_13qBrS4q0YMBNGxLOYcY3L_hX1ldyNR1EB_aKtkZSLV4W4Jly6I-LXXK4D_6OKbBgpptyZySDCbSl3GDTmkOark1pz_VdIP5qR1u2s8Xlaj-DtH1d2KUOIjiQhT3zRl3fIyLhNgHpnW0HAnBbrnYF_VfXrK4W_9nOVzpS12mNgeEGb3Rqr1aHKw4wtQzxunvuXRZ7bWq1zIF_rozUby-ddWV_bl1OJPQOgprxr0GJPFnT6lPI0PVWej8tIXlFgAK&access_type=offline',{ method: 'post'})

const jsonData = await response.json()
debugger;
console.log('response',response)
} catch (error) {
    debugger;
 console.log('error',error)       
}
}

getNewToken()

