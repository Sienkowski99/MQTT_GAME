import { useEffect, useState } from 'react'
import { connect } from "react-redux";
import operations from '../operations'
import { Card } from 'react-bootstrap'
import currentGameReducer from '../reducers/currentGame';

const mqtt = require('mqtt')
// const cl= mqtt.connect('mqtt://10.45.3.171/')

const Chat = (props) => {

    const [currentChat, SetCurrentChat] = useState("general")
    useEffect(()=>{
      // console.log(props.currentGame)
      if (props.data.prev_chat !== null) {
        props.clearChat()
        mqttUnSub(`/chat/${props.data.prev_chat}`)
        mqttSub(`/chat/${props.data.chat}`)
        SetCurrentChat(props.data.chat)
      } else {
        props.clearChat()
        mqttSub(`/chat/${props.data.chat}`)
        SetCurrentChat(props.data.chat)
      }
      // if (props.data.chat !== null && props.data.prev_chat !== null) {
      //   SetCurrentChat(props.data.chat)
      //   mqttUnSub(props.data.prev_chat)
      //   mqttSub(props.data.chat)
      // } else {
      //     SetCurrentChat("general")
      // }
      
    }, [props.data.chat])

    const [message, setMessage] = useState("")
    const handleSendMessage = (e) => {
        e.preventDefault()
        console.log("sending: "+message+"to: "+currentChat)
        mqttPublish({topic: `/chat/${currentChat}`, payload: JSON.stringify({author: props.player.login, message: message})})
    }
    const [client, setClient] = useState(null);
    const [isSub, setIsSub] = useState(false);
    const [connectStatus, setConnectStatus] = useState(null)
    const [chat, setChat] = useState([])
    const [chatReverse, setChatReverse] = useState([])

    useEffect(()=>{
        mqttConnect('ws://10.45.3.171:8000/mqtt')
    }, [])
    
    const mqttConnect = (host) => {
        setClient(mqtt.connect(host));
    };

    const mqttSub = (topic) => {
      console.log("SUB FOR : "+topic);
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

    const mqttUnSub = (topic) => {
        if (client) {
          // const { topic } = subscription;
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
            let x = message.toString()
            // if (topic === "/chat/general") {
            //     // console.log(chat)
            //     const req = JSON.parse(x)
            //     // console.log(req)
            //     setChat([...chat, {author: req.user, content: req.message}])
            //     // chat.push({author: "anonim", content: message.toString()})
            //     // console.log(chat)
            // }
            if (/\/chat\/(.*?)/.test(topic)) {
              const req = JSON.parse(x)
              console.log(chat)
              props.addComment({author: req.author, content: req.message})
              // setChat([...chat, {author: req.user, content: req.message}])
              // chat.push({author: "anonim", content: message.toString()})
            }
            // setPayload(payload);
          });
        }
      }, [client]);

    useEffect(()=>{
      console.log(props.chat)
      setChatReverse(props.chat.reverse())
    }, [props.chat])
    return (
        <div>
            <h2>Chat 🥇</h2>
            <div>
                <Card>
                    <Card.Body>
                        {/* <Card.Title>Chat 🥇</Card.Title> */}
                        <Card.Subtitle className="mb-2 text-muted">Chat ID: {currentChat}</Card.Subtitle>
                        <div style={{height: "50vh", overflowY: "scroll", background: "gray", display: "flex", flexDirection: "column-reverse"}}>
                            {chatReverse.map((msg, index)=><div style={{background: "none"}} key={index}><p>{msg.author}: {msg.content}</p></div>)}
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
        currentGame: state.currentGame,
        data: state.data,
        player: state.player
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        sendMessage: (msg) => dispatch(operations.send_message(msg)),
        chatOn: () => dispatch(operations.turnOnChat()),
        addComment: (commentObject) => dispatch(operations.add_comment(commentObject)),
        clearChat: () => dispatch(operations.clearChat())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);