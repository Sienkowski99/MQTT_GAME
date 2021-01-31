import {combineReducers} from "redux"
import listReducer from './list'
import currentGameReducer from './currentGame'
import playerReducer from './player'
import chatReducer from './chat'
import dataReducer from "./data"


const rootReducer = combineReducers({
    list: listReducer,
    currentGame: currentGameReducer,
    player: playerReducer,
    chat: chatReducer,
    data: dataReducer
});

export default rootReducer;
