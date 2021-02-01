import './App.css';
import GamesList from './components/GamesList';
import Chat from "./components/Chat"
import GameBoard from "./components/GameBoard"
import { connect } from "react-redux";
import operations from './operations'
import { Navbar, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { useEffect, useState } from "react";
import mqtt from 'mqtt'
const {v4: uuidv4} = require('uuid')

function App(props) {
  const [client, setClient] = useState(null);
  const [online, setOnline] = useState(0);
  useEffect(()=>{
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

  useEffect(() => {
      if (client) {
        console.log(client)
        client.on('connect', () => {
          console.log('Connected')
          mqttSub(`players_online`)
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
          if (topic === "players_online") {
              // setGamesList([...JSON.parse(message.toString()).games])
              // props.updateList(JSON.parse(message.toString()).games)
              // console.log(chat)
              setOnline(parseInt(message.toString()))
          }
          // setPayload(payload);
        });
      }
    }, [client]);

  const [login, setLogin] = useState("")

  const handleLogin = () => {
    console.log(login)
    axios.post("http://localhost:8080/verify_login", {login: login})
    .then(result=>{
      console.log(result)
      if (result.data === "OK") {
        props.login(login)
        const my_uuid = uuidv4()
        setInterval(()=>{
          axios.post("http://localhost:8080/presence", {login: login, id: my_uuid})
          .then(result=>console.log(result))
          .catch(err=>console.log(err))
        }, 1000)
      } else {
        alert(result.data)
      }
    })
    .catch(err=>console.log(err))
    // if (login === "") {
    //   alert("Your nickname cannot be empty")
    // } else {
    //   props.login(login)
    // }
  }
  
  const isLogged = () => {
    if (props.player.login !== "") {
      return (
        <div style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "self-start"}}>
          <GamesList/>
          {/* {props.currentGame ? <GameBoard/> : null} */}
          <GameBoard/>
          <Chat user={props.player.login}/>
        </div>
      )
    } else {
      return (
        <div style={{width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} className={"w3-animate-right"}>
          <form onSubmit={()=>{handleLogin(); resetForm()}} id="form" style={{display: "flex", flexDirection: "column"}}>
            <p>Enter your nickname: </p>
            <input type="text" onChange={(e)=>setLogin(e.target.value)} style={{marginBottom: "15px"}}/>
            <Button onClick={()=>handleLogin()} variant="light">ENTER</Button>
          </form>
        </div>
      )
    }
  }
  function resetForm() {
    document.getElementById("form").reset();
  }

  return (
    <div className="App App-header">
      <Navbar bg="dark" variant="dark" style={{display: "flex", justifyContent: "space-between", padding: "0 30px", width: "100%", alignItems: "center"}}>
        <Navbar.Brand href="">
          {/* <img
            alt=""
            src="/logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '} */}
          <div style={{display: "flex", background: "none", justifyContent: "space-between", alignItems: "center"}}>
            <h1 style={{margin: "0"}}>Kurnik 2.0</h1>
            <div style={{background: "none", width: "50px"}}></div>
            <h5 style={{margin: "0"}}>Players online: {online}</h5>
          </div>
        </Navbar.Brand>
        {props.player.login ? <p style={{margin: "0"}}>Logged in as: {props.player.login}</p> : null}
      </Navbar>
      {/* <header className="App-header"> */}
        
        {/* <Navbar bg="dark">
          <Navbar.Brand href="#home">Kurnik 2.0</Navbar.Brand>
        </Navbar> */}
        {/* <h1>Kurnik 2.0</h1> */}
        {/* {props.player.login ? <p>Logged in as: {props.player.login}</p> : null} */}
        {isLogged()}
        <div style={{width: "100%", backgroundColor: "gray"}}>
          <h1 style={{}}>Sieńkowski © </h1>
        </div>
      {/* </header> */}
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
