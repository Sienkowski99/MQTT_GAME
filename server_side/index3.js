const { json } = require('express')
const express = require('express')
const app = express()
const port = 8080
const cors = require('cors')
const {v4: uuidv4} = require('uuid')
app.use(express.json());
app.use(cors())

const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://10.45.3.171/')

client.on('connect', function () {
    client.subscribe('games', function (err) {
        if (err) {
            console.log('error' + err)
        }
    })
    // setTimeout(()=>{client.publish("games", "siema")}, 5000)
})

client.on('message', function (topic, message) {
    let x= message.toString()
    console.log(x)
    console.log(topic);
})
