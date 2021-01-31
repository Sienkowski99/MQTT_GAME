const { json } = require('express')
const express = require('express')
const app = express()
const port = 8080
const cors = require('cors')
const {v4: uuidv4} = require('uuid')
app.use(express.json());
app.use(cors())

const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://10.45.3.171/'
// , {
//     clean: false,
//     clientId: uuidv4()
// }
)

client.on('connect', function () {
    // client.subscribe('games_list', function (err) {
    //     if (err) {
    //         console.log('error' + err)
    //     }
    // })
    // client.subscribe('/chat/general', function (err) {
    //     if (err) {
    //         console.log('error' + err)
    //     }
    // })
    // const payload = {
    //     game_id: 1,
    //     players: ["abc", "def"],
    //     etc: {
    //         elo: "eluwina"
    //     }
    // }
    console.log("connected")
    client.publish("/game/0c6850f1-a240-4710-9c34-ac9a4edc0266", "eluwina")
    // setTimeout(()=>{client.publish("games", JSON.stringify(payload))}, 5000)
})

client.on('message', function (topic, message) {
    let x = message.toString()
    console.log(topic);
    // console.log(JSON.parse(x))
    console.log(x);
})
