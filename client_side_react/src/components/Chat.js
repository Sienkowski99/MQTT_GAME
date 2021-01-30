import { useEffect, useState } from 'react'
import { connect } from "react-redux";
import operations from '../operations'
import { Card } from 'react-bootstrap'
import currentGameReducer from '../reducers/currentGame';

const mqtt = require('mqtt')
// const cl= mqtt.connect('mqtt://10.45.3.171/')

const Chat = (props) => {

    const [currentChat, SetCurrentChat] = useState(null)
    useEffect(()=>{
        if (props.chat_id !== undefined) {
            SetCurrentChat(props.chat_id)
        } else {
            SetCurrentChat("general")
        }
    }, [props])

    useEffect(()=>{
        mqttConnect('ws://10.45.3.171:8000/mqtt')
    }, [])

    const [message, setMessage] = useState("")
    const handleSendMessage = (e) => {
        e.preventDefault()
        console.log("sending: "+message)
        mqttPublish({topic: "/chat/general", payload: message})
    }
    const [client, setClient] = useState(null);
    const [isSub, setIsSub] = useState(false);
    const [connectStatus, setConnectStatus] = useState(null)
    const [chat, setChat] = useState([])

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
            setIsSub(true)
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
            setIsSub(false);
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

    useEffect(() => {console.log(chat)}, [chat])

    useEffect(() => {
        if (client) {
          console.log(client)
          client.on('connect', () => {
            setConnectStatus('Connected');
            console.log('Connected')
            mqttSub(`/chat/${currentChat}`)
          });
          client.on('error', (err) => {
            console.error('Connection error: ', err);
            client.end();
          });
          client.on('reconnect', () => {
            setConnectStatus('Reconnecting');
          });
          client.on('message', (topic, message) => {
            const payload = { topic, message: message.toString() };
            console.log(payload)
            if (topic === "/chat/general") {
                console.log(chat)
                setChat([...chat, {author: "anonim", content: message.toString()}])
                chat.push({author: "anonim", content: message.toString()})
                // console.log(chat)
            }
            // setPayload(payload);
          });
        }
      }, [client]);

    return (
        <div>
            <h2>Chat 🥇</h2>
            <div>
                <Card>
                    <Card.Body>
                        {/* <Card.Title>Chat 🥇</Card.Title> */}
                        <Card.Subtitle className="mb-2 text-muted">Chat ID: {currentChat}</Card.Subtitle>
                        <div style={{height: "50vh", overflowY: "scroll", background: "gray", display: "flex", flexDirection: "column-reverse"}}>
                            {chat.reverse().map(msg=><div style={{background: "none"}}><p>{msg.author}: {msg.content}</p></div>)}
                        </div>
                        <form onSubmit={(e)=>{handleSendMessage(e)}}>
                            <p>Message</p>
                            <input type="text" onChange={(e)=>setMessage(e.target.value)}/>
                            <button type="submit">Send</button>
                        </form>
                    </Card.Body>
                </Card>
                {/* <p>{chat.length}</p>
                {chat.map(msg=><div><p>{msg.author}: {msg.content}</p></div>)}
                <form onSubmit={(e)=>{handleSendMessage(e)}}>
                    <label>Message</label>
                    <input type="text" onChange={(e)=>setMessage(e.target.value)}/>
                    <button type="submit">Send</button>
                </form> */}
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        chat: state.chat,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        sendMessage: (msg) => dispatch(operations.send_message(msg)),
        chatOn: () => dispatch(operations.turnOnChat())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);