import {combineReducers} from "redux"
import listReducer from './list'
import currentGameReducer from './currentGame'
import playerReducer from './player'
import chatReducer from './chat'


const rootReducer = combineReducers({
    list: listReducer,
    currentGame: currentGameReducer,
    player: playerReducer,
    chat: chatReducer
});

export default rootReducer;
