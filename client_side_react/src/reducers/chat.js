const chatReducer = (state = [], action) => {
    // console.log(action.payload)
    switch(action.type) {
        case 'SET_COMMENTS':
            return [...action.payload]
        case 'ADD_COMMENT':
            return [...state, action.payload]
        default:
            return state
    }
};

export default chatReducer; 