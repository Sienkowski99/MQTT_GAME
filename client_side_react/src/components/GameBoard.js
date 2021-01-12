import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setGamesList } from "../actions";

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
        }
        else {
            setGameState("")
        }
    }, [props])

    const drawBoard = (board) => {
        return (
            <div style={{display: "flex", flexDirection: "row"}}>
                {board.map(column => <div style={{display: "flex", flexDirection: "column-reverse"}}>
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
        currentGame: state.currentGame
    };
}

export default connect(mapStateToProps, null)(GameBoard);