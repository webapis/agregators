

 const actionTypes = {
    AUTH_SUCCESS: 'AUTH_SUCCESS',
}

export default (state, action) => {
    debugger;
    switch (action.type) {
        case actionTypes.AUTH_SUCCESS:
            debugger;
            return action.payload.auth 
        default:
            return state
    }


}

window.actionTypes = actionTypes