import { connect } from "react-redux";
import operations from '../operations/index'

const CreateGame = (props) => {
    return (
        <div>
            <button onClick={()=>{props.createGame()}} style={{marginBottom: "10px"}}>Create Game</button>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        createGame: () => dispatch(operations.create_game())
    }
}

export default connect(null, mapDispatchToProps)(CreateGame);