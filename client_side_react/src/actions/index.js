export const SET_GAMES_LIST = "SET_GAMES_LIST"
export const WATCH_GAME = "WATCH_GAME"
export const JOIN_GAME = "JOIN_GAME"

export const setGamesList = (list) => ({
    type: SET_GAMES_LIST,
    payload: list
})

export const watchGame = (game) => ({
    type: WATCH_GAME,
    payload: game
})

export const joinGame = (game) => ({
    type: JOIN_GAME,
    payload: game
})