import { connect } from "react-redux";
import operations from '../operations/index'
import { useEffect } from 'react';
import CreateGame from './CreateGame'

const GamesList = (props) => {

    const delay = 1000

    //componentDidMount
    useEffect(()=>{
    setInterval(()=>{
        props.updateList()
    }, delay)
    }, [])

    const handleWatch = (id) => {
        props.watchGame(id)
    }

    const handleJoin = (id) => {
        props.joinGame(id)
    }

    return (
        <div>
            <h2>GamesList 🏆</h2>
            {props.list.map(game => 
                <div style={{display: "flex", flexDirection: "column", border: "solid white 2px", padding: "10px"}}>
                    <p>{game.id}</p>
                    <p style={{margin: "5px"}}>Players: {game.players}/2</p>
                    <div style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-around", margin: "5px 0"}}>
                        <button onClick={()=>handleJoin(game.id)}>Join</button>
                        <button onClick={()=>handleWatch(game.id)}>Watch</button>
                    </div>
                </div>
            )}
            <CreateGame/>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        list: state.list
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateList: () => dispatch(operations.update_games_list()),
        watchGame: (id) => dispatch(operations.watch_game(id)),
        joinGame: (id) => dispatch(operations.join_game(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GamesList);