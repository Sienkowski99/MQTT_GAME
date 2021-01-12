import axios from 'axios'
import {setGamesList, watchGame, joinGame} from "../actions"

const update_games_list = () => async dispatch => {
    const new_list = await axios.get("http://localhost:8080/games_list")
    .then(result => {
        console.log(result);
        return result.data
    })
    .catch(err => {console.log(err)})
    dispatch(setGamesList(new_list))
}

const watch_game = (id) => async dispatch => {
    const game = await axios.get(`http://localhost:8080/game/${id}`)
    .then(result => {
        console.log(result);
        return result.data
    })
    .catch(err => {console.log(err)})
    dispatch(watchGame(game))
}

const join_game = (id) => async dispatch => {
    const game = await axios.get(`http://localhost:8080/game/${id}`)
    .then(result => {
        console.log(result);
        return result.data
    })
    .catch(err => {console.log(err)})
    dispatch(joinGame(game))
}

const create_game = () => async dispatch => {
    const new_list = await axios.get(`http://localhost:8080/create_game`)
    .then(result => {
        console.log(result);
        return result.data
    })
    .catch(err => {console.log(err)})
    dispatch(setGamesList(new_list))
}

const operations = {
    update_games_list,
    watch_game,
    join_game,
    create_game
}
  
export default operations