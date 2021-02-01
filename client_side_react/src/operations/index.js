import axios from 'axios'
import {setGamesList, watchGame, joinGame, leaveGame, logIN, updateGame, set_comments, set_data, addComment} from "../actions"

const delay = 1000

const update_games_list = (newList) => async dispatch => {
    // const new_list = await axios.get("http://localhost:8080/games_list")
    // .then(result => {
    //     // console.log(result);
    //     return result.data
    // })
    // .catch(err => {console.log(err)})
    // console.log("UPDATE")
    dispatch(setGamesList(newList))
}
const set_game = (game) => async (dispatch, state) => {
    const prev_chat = state().data.chat
    if (game) {
        // dispatch(set_comments([]))
        dispatch(joinGame(game))
        dispatch(set_data({chat: game.id, prev_chat: prev_chat}))
    } else {
        // dispatch(set_comments([]))
        dispatch(leaveGame(game))
        dispatch(set_data({chat: "general", prev_chat: prev_chat}))
    }
    
}

const add_comment = (obj) => async (dispatch, state) => {
    console.log(obj)
    dispatch(addComment({...obj, id: state().chat.length}))
}

const watch_game = (game) => async (dispatch,state) => {
    // setInterval(async ()=>{
    //     const game = await axios.get(`http://localhost:8080/game/${id}`)
    //     .then(result => {
    //     console.log(result);
    //     return result.data
    // })
    // .catch(err => {console.log(err)})
    // dispatch(watchGame(game))
    // }, delay) 
    const prev_chat = state().data.chat
    if (game) {
        // dispatch(set_comments([]))
        dispatch(watchGame(game))
        dispatch(set_data({chat: game.id, prev_chat: prev_chat}))
    } else {
        // dispatch(set_comments([]))
        dispatch(leaveGame(game))
        dispatch(set_data({chat: "general", prev_chat: prev_chat}))
    }
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

const leave_game = (id, login) => async (dispatch,state) => {
    // const game = await axios.post(`http://localhost:8080/leave_game/${id}`, {name: login})
    // .then(result => {
    //     console.log(result);
    //     return result.data
    // })
    // .catch(err => {console.log(err)})
    const prev_chat = state().data.chat
    dispatch(set_data({chat: "general", prev_chat: prev_chat}))
    dispatch(leaveGame({}))
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

const turnOnChat = () => async dispatch => {
    // setInterval(()=>{
    //     axios.get(`http://localhost:8080/chat/general`)
    //     .then((result)=>{
    //         console.log(result)
    //         dispatch(set_comments(result.data))
    //     })
    //     .catch(err=>console.log(err))
    // }, 333)
}

const clearChat = () => async dispatch => {
    dispatch(set_comments([]))
}

const send_message = (msg) => async dispatch => {
    axios.post(`http://localhost:8080/send_msg`, {msg: msg})
    .then(result=>console.log(result))
    .catch(err=>console.log(err))
}

const operations = {
    update_games_list,
    watch_game,
    join_game,
    create_game,
    leave_game,
    login,
    move,
    send_message,
    turnOnChat,
    set_game,
    add_comment,
    clearChat
}
  
export default operations