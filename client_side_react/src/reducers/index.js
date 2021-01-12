import {combineReducers} from "redux"
import listReducer from './list'
import currentGameReducer from './currentGame'
// import yearReducer from './year'


const rootReducer = combineReducers({
    list: listReducer,
    currentGame: currentGameReducer
});

export default rootReducer;
