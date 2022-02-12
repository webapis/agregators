 function mockGoogleOAuth(interceptedRequest) {
        const url = interceptedRequest._url
        if (url.includes('https://accounts.google.com/o/oauth2/v2/auth?scope=')) {
     
         
            interceptedRequest.continue({ url: 'https://localhost:8888/google-auth-callback' })

        } else if (url.includes('authorization_code')) {
         
            interceptedRequest.respond({
                status: 200,
                statusText: "",
                contentType: 'application/json',
                body: JSON.stringify({
                    access_token: "ya29.a0ARrdaM-XDqqUQYRRviXeYuEZKR_jPLWYjFgLzSfOH_SZL5_snxs_MN6k2W9_47kzP5xbXSb3m4wCXbgEYO6GcuUJDF7E3eUyl8lXBHIxZv17mex0Bx8xG0d5PUlbHoFwFzClBoBlR4WnYLPiel_GgQ5zNI5r",
                    expires_in: 3599,
                    refresh_token: "1//09DH2oyMTB7j3CgYIARAAGAkSNwF-L9IrDY9sO2i21DQ-qGcXWeBhjL8aa9VCLce0Jw7nUzD7JPvNlgJVltVwRWyrXInNIeHd84Y",
                    scope: "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/drive",
                    token_type: "Bearer",
                })
            })
        } else if (url.includes('https://localhost:8888/.netlify/functions/google-auth-callback')) {
      
         
            interceptedRequest.continue();
        }

        else {
            interceptedRequest.continue();
        }
    
}

module.exports = { mockGoogleOAuth }