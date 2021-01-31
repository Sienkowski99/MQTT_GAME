const dataReducer = (state = {chat: "general", prev_chat: null}, action) => {
    // console.log(action.type)
    switch(action.type) {
        case 'SET_DATA':
            return {...action.payload}
        default:
            return state
    }
};

export default dataReducer; 