import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setGamesList } from "../actions";
import operations from '../operations'
import { Card } from 'react-bootstrap'
const mqtt = require('mqtt')

const GameBoard = (props) => {

    const [gameState, setGameState] = useState("")
    const [boardState, setBoardState] = useState(null)

    useEffect(()=>{
        if (props.currentGame.state === "watching") {
            setGameState("Watching...")
            console.log("Watching...")
            console.log(props.currentGame)
            setBoardState(drawBoard(props.currentGame.game.boardState))
        }
        else if (props.currentGame.state === "playing") {
            // console.log("players" + props.currentGame.game.players)
            if (props.currentGame.game.players < 2) {
                setGameState("Waiting for another player to join !")
                setBoardState("")
            } else {
                setGameState(`Playing !\nCurrent move: ${props.currentGame.game.move}`)
                setBoardState(drawBoard(props.currentGame.game.boardState))
            }
        }
        else {
            setGameState("")
            setBoardState("")
        }
        if (props.currentGame.state) {
            if (props.currentGame.game.status === "finished") {
                setGameState(props.currentGame.game.msg)
            }
        }
    }, [props])

    const handleMove = (index) => {
        // if (props.currentGame.move === props.player.login) {
        //     props.move(props.player.login, index)
        // } else {
        //     alert("It's not your turn!")
        // }
        // props.move(props.player.login, index, props.currentGame.game.id)
        mqttPublish({topic: `/game/${props.currentGame.game.id}/move`, payload: JSON.stringify({name: props.player.login, index: index})})
    }

    const drawButtons = (index) => {
        // console.log(index)
        // if (props.currentGame.game.status === "playing") {
        if (props.currentGame.state === "playing") {
            if (props.currentGame.game.status !== "finished") {
                return (
                    <button onClick={()=>{handleMove(index)}} style={{marginTop: "5px", borderRadius: "50px"}}>☝️</button>
                )
            }
        } else {
            return (<div></div>)
        }
        
    }

    const [client, setClient] = useState(null);
    useEffect(()=>{
        console.log("RERENDER")
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
            // setPayload(payload);
          });
        }
      }, [client]);

    const drawBoard = (board) => {
        return (
            <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                {board.map((column, index) => <div key={index} style={{display: "flex", flexDirection: "column-reverse"}} onClick={()=>{console.log("siemka")}}>
                    {drawButtons(board.indexOf(column))}
                    {column.map((elem, index) => {
                        if (elem.length) {
                            if (elem[0] === "o") {
                                return <div key={index}>🔴</div>
                            } else {
                                return <div key={index}>🟡</div>
                            }
                        } else {
                            return <div key={index}>🔵</div>
                        }})}
                </div>)}
            </div>
        )
    }

    return (
        <div style={{width: "30%"}}>
            <h2 style={{marginBottom: "20px"}}>Game Board 📜</h2>
            {props.currentGame.game ? <Card>
                <Card.Body style={{backgroundColor: "#3b424f"}}>
                    <Card.Title style={{marginBottom: "3px", background: "none"}}>{gameState}</Card.Title>
                    {/* {props.currentGame ? drawBoard(props.currentGame.boardState) : null} */}
                    {boardState}
                </Card.Body>
            </Card> : <h3 style={{margin: "100px 0"}}>You have to choose the lobby</h3>}
        </div>
    )
}


function mapStateToProps(state) {
    return {
        currentGame: state.currentGame,
        player: state.player
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        move: (player, index, id) => dispatch(operations.move(player, index, id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);