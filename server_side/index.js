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
        this.boardState = [[[],[],[],[],[],[]],
        [[],[],[],[],[],[]],
        [[],[],[],[],[],[]],
        [[],[],[],[],[],[]],
        [[],[],[],[],[],[]],
        [[],[],[],[],[],[]],
        [[],[],[],[],[],[]]]
    }
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
    console.log(req.params)
    const obj = games.filter(game => game.id === req.params.id)[0]
    res.send(obj)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})