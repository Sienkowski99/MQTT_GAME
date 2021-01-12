import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setGamesList } from "../actions";
import operations from '../operations'

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
            setGameState("Playing !")
            setBoardState(drawBoard(props.currentGame.game.boardState))
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
        props.move(props.player.login, index, props.currentGame.game.id)
    }

    const drawButtons = (index) => {
        console.log(index)
        // if (props.currentGame.game.status === "playing") {
        if (props.currentGame.state === "playing") {
            if (props.currentGame.game.status !== "finished") {
                return (
                    <button onClick={()=>{handleMove(index)}} style={{marginTop: "5px"}}>☝️</button>
                )
            }
        } else {
            return (<div></div>)
        }
        
    }

    const drawBoard = (board) => {
        return (
            <div style={{display: "flex", flexDirection: "row"}}>
                {board.map(column => <div style={{display: "flex", flexDirection: "column-reverse"}} onClick={()=>{console.log("siemka")}}>
                    {drawButtons(board.indexOf(column))}
                    {column.map(elem => {
                        if (elem.length) {
                            if (elem[0] === "o") {
                                return <div>🔴</div>
                            } else {
                                return <div>🟡</div>
                            }
                        } else {
                            return <div>🔵</div>
                        }})}
                </div>)}
            </div>
        )
    }

    return (
        <div>
            <h2>Game Board 📜</h2>
            <p>{gameState}</p>
            {/* {props.currentGame ? drawBoard(props.currentGame.boardState) : null} */}
            {boardState}
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