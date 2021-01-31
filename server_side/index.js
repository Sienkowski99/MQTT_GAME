const { json } = require('express')
const express = require('express')
const app = express()
const port = 8080
const cors = require('cors')
const {v4: uuidv4} = require('uuid')
app.use(express.json());
app.use(cors())

let games = []

class Game {
    constructor () {
        this.id = uuidv4()
        this.players = 0
        this.playersIDs = []
        this.boardState = [
            [[],[],[],[],[],[]],
            [[],[],[],[],[],[]],
            [[],[],[],[],[],[]],
            [[],[],[],[],[],[]],
            [[],[],[],[],[],[]],
            [[],[],[],[],[],[]],
            [[],[],[],[],[],[]]
        ]
        this.status = "waiting for players"
        this.move = null
        this.msg = "Waiting for players..."
    }
}

const checkWhoWon = (board, char) => {
    //UPRIGHT
    for (column=0; column<7;column++) {
        for (row=0; row<3; row++) {
            if (board[column][row] === char && board[column][row+1] === char && board[column][row+2] === char && board[column][row+3] === char) {
                return true
            }
        }
    }
    //HORIZONTAL
    for (column=0; column<4;column++) {
        for (row=0; row<6; row++) {
            if (board[column][row] === char && board[column+1][row] === char && board[column+2][row] === char && board[column+3][row] === char) {
                return true
            }
        }
    }
    //DIAGONAL DESCENDING
    for (column=0; column<4;column++) {
        for (row=5; row>2; row--) {
            if (board[column][row] === char && board[column+1][row-1] === char && board[column+2][row-2] === char && board[column+3][row-3] === char) {
                return true
            }
        }
    }
    //DIAGONAL ASCENDING
    for (column=0; column<4;column++) {
        for (row=0; row<3; row++) {
            if (board[column][row] === char && board[column+1][row+1] === char && board[column+2][row+2] === char && board[column+3][row+3] === char) {
                return true
            }
        }
    }
    return false
}
app.get('/', (req, res) => {
  res.send('Hello World!')
})

const mqtt = require('mqtt')
// const { default: GamesList } = require('../client_side_react/src/components/GamesList')
const client  = mqtt.connect('mqtt://10.45.3.171/')

let games_list = {
    games: []
}

setInterval(()=>{
    // console.log(games_list)
    client.publish("games_list", JSON.stringify(games_list))
},100)

client.on('connect', function () {
    client.subscribe('/chat/general', function (err) {
        if (err) {
            console.log('error' + err)
        }
    })
    // client.subscribe('games_list', function (err) {
    //     if (err) {
    //         console.log('error' + err)
    //     }
    // })
    client.subscribe('new_game', function (err) {
        if (err) {
            console.log('error' + err)
        }
    })
    client.subscribe('join_game', function (err) {
        if (err) {
            console.log('error' + err)
        }
    })
    client.subscribe('leave_game', function (err) {
        if (err) {
            console.log('error' + err)
        }
    })
})

client.on('message', function (topic, message) {
    let x = message.toString()
    // console.log(JSON.parse(x))
    console.log(topic);
    console.log(x);
    
    if (topic === "new_game") {
        // games_list=message.toString().split(",")
        console.log("creating new game")
        let gra = new Game()
        client.subscribe(`/game/${gra.id}/move`, function (err) {
            if (err) {
                console.log('error' + err)
            }
        })
        games_list.games.push(gra)
    }
    if (topic === "make_move") {
        console.log(JSON.parse(x))
    }
    if (topic === "join_game") {
        const req = JSON.parse(x)
        console.log(req)
        // console.log(games_list)
        const obj = games_list.games.filter(game => game.id === req.id)[0]
        if (obj.players < 2) {
            if (!obj.playersIDs.includes(req.name)) {
                obj.playersIDs.push(req.name)
                obj.players += 1
            }
        }
        if (obj.players >= 2 && obj.status !== "finished") {
            obj.move = obj.playersIDs[0]
            obj.status = "playing"
        }
        // console.log(games_list)
    }
    if (topic === "leave_game") {
        const req = JSON.parse(x)
        console.log(req)
        const obj = games_list.games.filter(game => game.id === req.id)[0]
        if (obj.playersIDs.includes(req.name)) {
            obj.playersIDs = obj.playersIDs.filter(id => {if (req.name !== id) {return true}})
            obj.players -= 1
        }
        if (obj.players <= 0 && obj.status === "finished") {
            games_list.games = games_list.games.filter(game => game.id !== req.id)
        }
        // res.send(obj)
    }
    // let checkID = new RegExp('/game/*/move')
    // console.log()
    if (/\/game\/.*\/move/.test(topic)) {
        const req = {...JSON.parse(x), id: topic.split('/')[2]}
        console.log(req)
        // console.log(topic.split('/'))
        const obj = games_list.games.filter(game => game.id === req.id)[0]
        console.log(obj.move === req.name)
        if (obj.move === req.name) {
            let x
            for (i=0; i<6; i++) {
                if (!obj.boardState[req.index][i].length) {
                    x = i
                    break;
                }
            }
            console.log(obj)
            if (req.name === obj.playersIDs[0]) {
                obj.boardState[req.index][x] = "o"
                let z = checkWhoWon(obj.boardState, "o")
                if (z) {
                    obj.msg = `${req.name} has won!`
                    obj.status = "finished"
                    obj.move = null
                } else {
                    obj.move = obj.playersIDs[1]
                }
                console.log(obj)
            } else if (req.name === obj.playersIDs[1]) {
                obj.boardState[req.index][x] = "x"
                let z = checkWhoWon(obj.boardState, "x")
                if (z) {
                    obj.msg = `${req.name} has won!`
                    obj.status = "finished"
                    obj.move = null
                } else {
                    obj.move = obj.playersIDs[0]
                }
                console.log(obj)
            }
        } else{
            console.log("err")
        }
    }
})

// app.get('/make_new', (req, res) => {
    
//     const payload = {
//         game_id: 1,
//         players: ["abc", "def"],
//         etc: {
//             elo: "eluwina"
//         }
//     }
//     games_list.push(payload)
//     console.log(games_list)
//     client.publish("games_list", JSON.stringify(payload))


//     res.send('new game!')
// })

// let messages = []
// app.get('/send_msg', (req, res) => {
//     // console.log(req.body);
//     // messages.push({author: "anon", content: "WLO", id: uuidv4()})
//     client.publish("/chat/general", "eloo")
//     res.send("OK")
// })

// app.get('/chat/general', (req, res) => {
//     console.log("MESSAGES");
//     console.log(messages)
//     res.send(messages)
// })

// app.get('/games_list', (req, res) => {
//     // console.log(games)
//     res.send(games)
// })

// app.get('/create_game', (req, res) => {
//     let gra = new Game()
//     games.push(gra)
//     res.send(games)
// })

// app.get('/game/:id', (req, res) => {
//     // console.log(req.params)
//     const obj = games.filter(game => game.id === req.params.id)[0]
//     res.send(obj)
// })

// app.post('/join_game/:id', (req, res) => {
//     // console.log(req.body)
//     const obj = games.filter(game => game.id === req.params.id)[0]
//     if (obj.players < 2) {
//         if (!obj.playersIDs.includes(req.body.name)) {
//             obj.playersIDs.push(req.body.name)
//             obj.players += 1
//         }
//     }
//     if (obj.players >= 2) {
//         obj.move = obj.playersIDs[0]
//         obj.status = "playing"
//     }
//     res.send(obj)
// })

// app.post('/leave_game/:id', (req, res) => {
//     // console.log(req.body)
//     const obj = games.filter(game => game.id === req.params.id)[0]
//     if (obj.playersIDs.includes(req.body.name)) {
//         obj.playersIDs = obj.playersIDs.filter(id => {if (req.body.name !== id) {return true}})
//         obj.players -= 1
//     }
//     if (obj.players <= 0 && obj.status === "finished") {
//         games = games.filter(game => game.id !== req.params.id)
//     }
//     res.send(obj)
// })

// app.post('/:id/make_move', (req, res) => {
//     console.log(req.body)
//     const obj = games.filter(game => game.id === req.params.id)[0]
//     console.log(obj.move === req.body.name)
//     if (obj.move === req.body.name) {
//         let x
//         for (i=0; i<6; i++) {
//             if (!obj.boardState[req.body.index][i].length) {
//                 x = i
//                 break;
//             }
//         }
//         console.log(obj)
//         if (req.body.name === obj.playersIDs[0]) {
//             obj.boardState[req.body.index][x] = "o"
//             let z = checkWhoWon(obj.boardState, "o")
//             if (z) {
//                 obj.msg = `${req.body.name} has won!`
//                 obj.status = "finished"
//                 obj.move = null
//             } else {
//                 obj.move = obj.playersIDs[1]
//             }
//             console.log(obj)
//         } else if (req.body.name === obj.playersIDs[1]) {
//             obj.boardState[req.body.index][x] = "x"
//             let z = checkWhoWon(obj.boardState, "x")
//             if (z) {
//                 obj.msg = `${req.body.name} has won!`
//                 obj.status = "finished"
//                 obj.move = null
//             } else {
//                 obj.move = obj.playersIDs[0]
//             }
//             console.log(obj)
//         }
//         res.send(obj)
//     } else{
//         res.send("err")
//     }
// })









// client.on('connect', function () {
//     client.subscribe('games_list', function (err) {
//         if (err) {
//             console.log('error' + err)
//         }
//     })
// })

// let games_list = []
// const game = {
//     id: uuidv4(),
//     number_of_players_needed: 2,
//     number_of_players_connected: 0,
//     players: [],
//     finished: false
// }

// client.on('message', function (topic, message) {
//     let x = message.toString()
//     // console.log(JSON.parse(x))
//     console.log(topic);
//     console.log(x);
    
//     if (topic === "games_list") {
//         games_list = console.log(JSON.parse(x))
//     }
// })


// app.post('/get_games_list', (req, res) => {

// })
























app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})