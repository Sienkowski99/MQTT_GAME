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

app.get('/games_list', (req, res) => {
    console.log(games)
    res.send(games)
})

app.get('/create_game', (req, res) => {
    let gra = new Game()
    games.push(gra)
    res.send(games)
})

app.get('/game/:id', (req, res) => {
    // console.log(req.params)
    const obj = games.filter(game => game.id === req.params.id)[0]
    res.send(obj)
})

app.post('/join_game/:id', (req, res) => {
    // console.log(req.body)
    const obj = games.filter(game => game.id === req.params.id)[0]
    if (obj.players < 2) {
        if (!obj.playersIDs.includes(req.body.name)) {
            obj.playersIDs.push(req.body.name)
            obj.players += 1
        }
    }
    if (obj.players >= 2) {
        obj.move = obj.playersIDs[0]
        obj.status = "playing"
    }
    res.send(obj)
})

app.post('/leave_game/:id', (req, res) => {
    // console.log(req.body)
    const obj = games.filter(game => game.id === req.params.id)[0]
    if (obj.playersIDs.includes(req.body.name)) {
        obj.playersIDs = obj.playersIDs.filter(id => {if (req.body.name !== id) {return true}})
        obj.players -= 1
    }
    if (obj.players <= 0 && obj.status === "finished") {
        games = games.filter(game => game.id !== req.params.id)
    }
    res.send(obj)
})

app.post('/:id/make_move', (req, res) => {
    console.log(req.body)
    const obj = games.filter(game => game.id === req.params.id)[0]
    console.log(obj.move === req.body.name)
    if (obj.move === req.body.name) {
        let x
        for (i=0; i<6; i++) {
            if (!obj.boardState[req.body.index][i].length) {
                x = i
                break;
            }
        }
        console.log(obj)
        if (req.body.name === obj.playersIDs[0]) {
            obj.boardState[req.body.index][x] = "o"
            let z = checkWhoWon(obj.boardState, "o")
            if (z) {
                obj.msg = `${req.body.name} has won!`
                obj.status = "finished"
                obj.move = null
            } else {
                obj.move = obj.playersIDs[1]
            }
            console.log(obj)
        } else if (req.body.name === obj.playersIDs[1]) {
            obj.boardState[req.body.index][x] = "x"
            let z = checkWhoWon(obj.boardState, "x")
            if (z) {
                obj.msg = `${req.body.name} has won!`
                obj.status = "finished"
                obj.move = null
            } else {
                obj.move = obj.playersIDs[0]
            }
            console.log(obj)
        }
        res.send(obj)
    } else{
        res.send("err")
    }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})