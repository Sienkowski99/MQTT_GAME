const currentGameReducer = (state = {}, action) => {
    console.log(action.type)
    switch(action.type) {
        case 'WATCH_GAME':
            return {state: "watching", game: action.payload}
        case 'JOIN_GAME':
            return {state: "playing", game: action.payload}
        default:
            return state
    }
};

export default currentGameReducer; 