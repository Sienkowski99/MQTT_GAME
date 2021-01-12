export const SET_GAMES_LIST = "SET_GAMES_LIST"
export const WATCH_GAME = "WATCH_GAME"
export const JOIN_GAME = "JOIN_GAME"
export const LEAVE_GAME = "LEAVE_GAME"
export const UPDATE_GAME = "UPDATE_GAME"
export const LOGIN = "LOGIN"

export const setGamesList = (list) => ({
    type: SET_GAMES_LIST,
    payload: list
})

export const watchGame = (game) => ({
    type: WATCH_GAME,
    payload: game
})

export const updateGame = (game) => ({
    type: UPDATE_GAME,
    payload: game
})

export const joinGame = (game) => ({
    type: JOIN_GAME,
    payload: game
})

export const leaveGame = (game) => ({
    type: LEAVE_GAME,
    payload: game
})

export const logIN = (login) => ({
    type: LOGIN,
    payload: login
})