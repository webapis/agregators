export const config = {
    /* values set in terminal session or in netlify environment variables */

    gh_client_secret:process.env.gh_client_secret,
    gh_client_id: process.env.gh_client_id,
    state:'git_auth',
    // /* Intercom oauth API endpoints */
    // tokenHost: intercomApi,
    // authorizePath: `${intercomApi}/oauth`,
    // tokenPath: `${intercomApi}/auth/eagle/token`,
    // profilePath: `${intercomApi}/me/`,
    // /* redirect_uri is the callback url after successful signin */
    gh_redirectUrl: process.env.gh_redirectUrl,
  }