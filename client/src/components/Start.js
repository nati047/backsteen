import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import Canvas from "./Canvas";
import "./Style.css";


function Start({socket}) {
// console.log("props in start", socket)
  const [name, setName] = useState('');  
  const [code, setCode] = useState('')
  const [mode, setMode] = useState('');  
  const [randomCode, setRandomCode] = useState('');

  const handleSubmit = () => {
    console.log("submitted");
    setMode("gotName");
  };

  const generateCode = () => {
    let result = "";
    let characters = "abcdefghijklmnopqrstuvwxyz";
    let charactersLength = characters.length;
    for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const createGameHandler = () => {
    let c = generateCode();
    setRandomCode(c);
    socket.emit('createGame', { code: c})
    console.log(randomCode);
    setMode('create');
  };

  const joinGameHandler = () =>{
    // socket.emit('joined game')
    console.log("join game clicked");
    setMode("join");
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleCodeSubmit = (e) => {
    socket.emit('checkCode', code);
    setMode('checkingCode');
  };

  const handleCodeChange = (e) =>{
    setCode(e.target.value)
  };

  socket.on('matched', () =>{
    console.log('sending you to the game');
    // socket.emit('playerName', {name, code});
    setMode("codeAccepted");
  });

  return (
    <div>
      <h1 className="title">Welcome To Multiplaer Brick Game</h1>

      {mode === "" && (
        <form onSubmit={handleSubmit}>
          <div>
            <label className="labelin">Please input your intials</label>
          </div>
          <input
            className="label-input"
            value={name}
            type="text"
            onChange={handleNameChange}
          ></input>
          <div>
            <button className="button" type="submit">
              Next
            </button>
          </div>
        </form>
      )}
      {/* <Link to="/leaders">
        <h3>leadersBoard</h3>
      </Link> */}

      {mode === "gotName" && (
        <div>
          <button className="button-create" onClick={createGameHandler}>
            {" "}
            create game
          </button>
          <h1 className="or">Or</h1>
          <button className="button-join" onClick={joinGameHandler}>
            {" "}
            Join game
          </button>
        </div>
      )}
      {mode === "create" && (
        <div>
          <h3>copy game code and send to friend</h3>
          <h1> game code : {randomCode}</h1>
          <h3>waiting for other player to join</h3>
        </div>
      )}
      {mode === "join" && (
        <form onSubmit={handleCodeSubmit}>
          <div>
            <label className="label-join">Input game code</label>
          </div>

          <input
            className="label-input"
            value={code}
            type="text"
            onChange={handleCodeChange}
          ></input>
          <div>
            <button className="button" type="submit">
              Next
            </button>
          </div>
        </form>
      )}
      <Link to="/controls">
        <h3 className="controls">How to play</h3>
      </Link>

      {mode === "checkingCode" && <h1>checking code</h1>}
      {mode === "codeAccepted" && <Navigate to="/game" />}
    </div>
  );
}

export default Start;
