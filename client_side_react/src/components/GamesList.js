import { connect } from "react-redux";
import operations from '../operations/index'
import { useEffect, useState } from 'react';
import CreateGame from './CreateGame'
import { Card } from 'react-bootstrap'
const {v4: uuidv4} = require('uuid')
const mqtt = require('mqtt')


const GamesList = (props) => {

    const delay = 1000
    // console.log(props.currentGame)
    //componentDidMount
    // useEffect(()=>{
    // setInterval(()=>{
    //     props.updateList()
    // }, delay)
    // }, [])

    const [gamesList, setGamesList] = useState([])
    const [client, setClient] = useState(null);
    useEffect(()=>{
        console.log("RERENDER")
        mqttConnect('ws://10.45.3.171:8000/mqtt')
    }, [])
    
    useEffect(()=>{
        // setGamesList(props.list)
        
        if (props.list.length) {
            // console.log(props.list)
            props.setGame(props.list.filter(game=>game.playersIDs.includes(login))[0])
            // console.log(login)
            // console.log(props.list.filter(game=>game.playersIDs.includes(login)))
        } else {
            props.leaveGame()
        }
        
    }, [props.list])

    
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
            mqttSub(`games_list`)
          });
          client.on('error', (err) => {
            console.error('Connection error: ', err);
            client.end();
          });
          client.on('reconnect', () => {
          });
          client.on('message', (topic, message) => {
            const payload = { topic, message: message.toString() };
            // console.log(payload)
            if (topic === "games_list") {
                // setGamesList([...JSON.parse(message.toString()).games])
                props.updateList(JSON.parse(message.toString()).games)
                // console.log(chat)
            }
            // setPayload(payload);
          });
        }
      }, [client]);

    const handleWatch = (id) => {
        props.watchGame(id)
    }

    const [login, setLogin] = useState(props.player.login)

    // useEffect(()=>{
    //     setLogin(props.player.login)
    // }, [props])

    const handleJoin = (id) => {
        // props.joinGame(id, login)
        mqttPublish({topic: "join_game", payload: JSON.stringify({name: login, id: id})})
    }

    const handleLeave = (id) => {
        // props.leaveGame(id, login)
        mqttPublish({topic: "leave_game", payload: JSON.stringify({name: login, id: id})})
    }

    const gameID = (id) => {
        // console.log(props)
        if (props.currentGame.game) {
            if (props.currentGame.game.id === id) {
                return <p style={{color: "orange"}}>{id}</p>
            } else {
                return <p>{id}</p>
            }
        } else {
            return (<p>{id}</p>)
        }
    }

    const drawButtons = (game) => {
        if (props.currentGame.game) {
            if (props.currentGame.game.playersIDs.includes(login) && props.currentGame.game.id === game.id) {
                return (<button onClick={()=>handleLeave(game.id)}>Leave</button>)
            } else {
                if (props.currentGame.state === "playing") {
                } else {
                    if (game.players >= 2) {
                        return (
                            <div style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-around", margin: "5px 0"}}>
                            <button onClick={()=>handleWatch(game.id)}>Watch</button>
                        </div>
                        )
                    }
                    else {
                        return (
                            <div style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-around", margin: "5px 0"}}>
                                <button onClick={()=>handleJoin(game.id)}>Join</button>
                                <button onClick={()=>handleWatch(game.id)}>Watch</button>
                            </div>
                        )
                    }
                }
            }
        }
        else {
            if (game.players >= 2) {
                return (
                    <div style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-around", margin: "5px 0"}}>
                    <button onClick={()=>handleWatch(game.id)}>Watch</button>
                </div>
                )
            }
            else {
                return (
                    <div style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-around", margin: "5px 0"}}>
                        <button onClick={()=>handleJoin(game.id)}>Join</button>
                        <button onClick={()=>handleWatch(game.id)}>Watch</button>
                    </div>
                )
            }
        }
    }

    return (
        <div>
            <h2>GamesList 🏆</h2>
            <Card>
                <Card.Body>
                    
                    {/* <Card.Subtitle>GamesList 🏆</Card.Subtitle> */}
                    {/* <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center", marginBottom: "5px"}}>
                        <label>Type in your username </label>
                        <input type="text" onChange={(e)=>setLogin(e.target.value)} style={{margin: "5px 0"}}/>
                    </div> */}
                    {props.list.map((game, index) => 
                        <div key={index} style={{display: "flex", flexDirection: "column", border: "solid white 2px", padding: "10px", marginBottom: "5px"}}>
                            {gameID(game.id)}
                            {/* {props.game ? {props.game.game.id === game.id ? <p style={{color: "blue"}}>{game.id}</p> : <p>{game.id}</p>} : null} */}
                            <p style={{margin: "5px"}}>Players: {game.players}/2</p>
                            <div style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-around", margin: "5px 0"}}>
                                {drawButtons(game)}
                            </div>
                        </div>
                    )}
                    <CreateGame/>
                </Card.Body>
            </Card>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        list: state.list,
        currentGame: state.currentGame,
        player: state.player
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateList: (list) => dispatch(operations.update_games_list(list)),
        watchGame: (id) => dispatch(operations.watch_game(id)),
        joinGame: (id, login) => dispatch(operations.join_game(id, login)),
        leaveGame: (id, login) => dispatch(operations.leave_game(id, login)),
        setGame: (game) => dispatch(operations.set_game(game))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GamesList);