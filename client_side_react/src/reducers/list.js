const listReducer = (state = [], action) => {
    console.log(action.type)
    console.log(action.payload)
    switch(action.type) {
        case 'SET_GAMES_LIST':
            return [...action.payload]
        default:
            return state
    }
};

export default listReducer; 