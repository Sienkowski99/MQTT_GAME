import axios from 'axios'
import {setGamesList, watchGame, joinGame, leaveGame, logIN, updateGame} from "../actions"

const delay = 1000

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
    setInterval(async ()=>{
        const game = await axios.get(`http://localhost:8080/game/${id}`)
        .then(result => {
        console.log(result);
        return result.data
    })
    .catch(err => {console.log(err)})
    dispatch(watchGame(game))
    }, delay) 
}

const join_game = (id, login) => async dispatch => {
    axios.post(`http://localhost:8080/join_game/${id}`, {name: login})
    .then(result => {
        console.log(result);
        // return result.data
        dispatch(joinGame(result.data))
        setInterval(async ()=>{
            const game = await axios.get(`http://localhost:8080/game/${id}`)
            .then(result => {
            console.log(result);
            return result.data
        })
        .catch(err => {console.log(err)})
        dispatch(updateGame(game))
        }, delay) 
    })
    .catch(err => {console.log(err)})
    
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

const leave_game = (id, login) => async dispatch => {
    const game = await axios.post(`http://localhost:8080/leave_game/${id}`, {name: login})
    .then(result => {
        console.log(result);
        return result.data
    })
    .catch(err => {console.log(err)})
    dispatch(leaveGame(game))
}

const login = (log) => async dispatch => {
    dispatch(logIN(log))
}

const move = (login, index, id) => async dispatch => {
    axios.post(`http://localhost:8080/${id}/make_move`, {name: login, index: index})
    .then(result => {
        console.log(result);
        if (result.data === "err") {
            alert("It's not your turn!")
        } else {
            if (result.data.status === "finished") {
                
            }
            dispatch(updateGame(result.data))
        }
        // return 
    })
    .catch(err => {console.log(err)})
    
}

const operations = {
    update_games_list,
    watch_game,
    join_game,
    create_game,
    leave_game,
    login,
    move
}
  
export default operations