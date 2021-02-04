const userReducer = (state = null, action) => {
    switch (action.type) {
        case "SAVE_USER":
            state = action.data
            return state
        default:
            return state
    }
}



export default userReducer