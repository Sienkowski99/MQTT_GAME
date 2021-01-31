import { connect } from "react-redux";
import operations from '../operations/index'
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap'
const mqtt = require('mqtt')

const CreateGame = (props) => {

    const [client, setClient] = useState(null);
    useEffect(()=>{
        mqttConnect('ws://10.45.3.171:8000/mqtt')
    }, [])
    
    const mqttConnect = (host) => {
        setClient(mqtt.connect(host));
    };

    const mqttSub = (topic) => {
        if (client) {
          client.subscribe(topic, (error) => {
            if (error) {
              console.log('Subscribe to topics error', error)
              return
            }
          });
        }
      };

    const mqttUnSub = (subscription) => {
        if (client) {
          const { topic } = subscription;
          client.unsubscribe(topic, error => {
            if (error) {
              console.log('Unsubscribe error', error)
              return
            }
          });
        }
      };

    const mqttPublish = (context) => {
    if (client) {
        const { topic, payload } = context;
        client.publish(topic, payload, error => {
        if (error) {
            console.log('Publish error: ', error);
        }
        });
    }
    }

    useEffect(() => {
        if (client) {
          console.log(client)
          client.on('connect', () => {
            console.log('Connected')
            // mqttSub(`games_list`)
            // mqttPublish({topic: "new_game", payload: "new"})
          });
          client.on('error', (err) => {
            console.error('Connection error: ', err);
            client.end();
          });
          client.on('reconnect', () => {
          });
          client.on('message', (topic, message) => {
            const payload = { topic, message: message.toString() };
            console.log(payload)
            if (topic === "games_list") {
                // setGamesList(JSON.parse(message.toString()))
                // console.log(chat)
            }
            // setPayload(payload);
          });
        }
      }, [client]);

    return (
        <div style={{background: "none"}}>
            <Button onClick={()=>{
                mqttPublish({topic: "new_game", payload: "new"})
            }} variant="light">Create Game</Button>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        createGame: () => dispatch(operations.create_game())
    }
}

export default connect(null, mapDispatchToProps)(CreateGame);