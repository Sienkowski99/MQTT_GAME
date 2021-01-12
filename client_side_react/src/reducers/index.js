import {combineReducers} from "redux"
import listReducer from './list'
import currentGameReducer from './currentGame'
import playerReducer from './player'
// import yearReducer from './year'


const rootReducer = combineReducers({
    list: listReducer,
    currentGame: currentGameReducer,
    player: playerReducer
});

export default rootReducer;
