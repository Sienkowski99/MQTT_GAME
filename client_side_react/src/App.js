import './App.css';
import GamesList from './components/GamesList';
import Chat from "./components/Chat"
import GameBoard from "./components/GameBoard"
import { connect } from "react-redux";

function App(props) {

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kurnik 2.0</h1>
        <div style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "self-start"}}>
          <GamesList/>
          {props.currentGame ? <GameBoard/> : null}
          <Chat/>
        </div>
        <div style={{width: "100%", backgroundColor: "gray"}}>
          <h1>Footer</h1>
        </div>
      </header>
    </div>
  );
}

function mapStateToProps(state) {
  return {
      currentGame: state.currentGame
  };
}

export default connect(mapStateToProps, null)(App);
