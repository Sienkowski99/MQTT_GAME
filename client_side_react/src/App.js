import './App.css';
import GamesList from './components/GamesList';
import Chat from "./components/Chat"
import GameBoard from "./components/GameBoard"
import { connect } from "react-redux";
import operations from './operations'
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

function App(props) {

  const [login, setLogin] = useState("")

  const handleLogin = () => {
    if (login === "") {
      alert("Your nickname cannot be empty")
    } else {
      props.login(login)
    }
  }
  
  const isLogged = () => {
    if (props.player.login !== "") {
      return (
        <div style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "self-start"}}>
          <GamesList/>
          {props.currentGame ? <GameBoard/> : null}
          <Chat/>
        </div>
      )
    } else {
      return (
        <div style={{width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
          <p>Enter your nickname: </p>
          <input type="text" onChange={(e)=>setLogin(e.target.value)} style={{marginBottom: "15px"}}/>
          <button onClick={()=>handleLogin()}>ENTER</button>
        </div>
      )
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>Kurnik 2.0</h1>
        {props.player.login ? <p>Logged in as: {props.player.login}</p> : null}
        {isLogged()}
        <div style={{width: "100%", backgroundColor: "gray"}}>
          <h1>Sienkowski © </h1>
        </div>
      </header>
    </div>
  );
}

function mapStateToProps(state) {
  return {
      currentGame: state.currentGame,
      player: state.player
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
      login: (login) => dispatch(operations.login(login)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
