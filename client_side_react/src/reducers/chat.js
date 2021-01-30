const chatReducer = (state = [], action) => {
    console.log(action.type)
    switch(action.type) {
        case 'SET_COMMENTS':
            return [...action.payload]
        default:
            return state
    }
};

export default chatReducer; 