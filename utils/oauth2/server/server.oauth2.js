function exchangeCodeForAccessToken({ client_id, client_secret, code, redirect_uri }) {
    const grant_type = 'authorization_code';
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/token';
}

function refreshAccessToken({ client_id, client_secret, refresh_token }) {
    const grant_type = 'refresh_token';
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/token';
}

function revokeToken({ token }) {
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/revoke';
}