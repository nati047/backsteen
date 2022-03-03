import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import "./Style.css";
import logo from "../brick.png";

function Start({ socket }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [mode, setMode] = useState("");
  const [randomCode, setRandomCode] = useState("");

  const handleSubmit = () => {
    if(name)
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
    socket.emit("createGame", { code: c, name });
    setMode("create");
  };

  const joinGameHandler = () => {
    setMode("join");
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleCodeSubmit = (e) => {
    socket.emit("checkCode", { code, name });
    setMode("checkingCode");
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  socket.on("matched", () => {
    setMode("codeAccepted");
  });

  return (
    <div>
      <div>
        <img className="image" src={logo} alt="logo" />
        <Link className="contols-link" controls to="/controls">
          <h3 className="controls">How to play</h3>
          <Link className='leaders-link' to="/leaders">
            <h3 className="leaders">Leaderboard</h3>
          </Link>
        </Link>
      </div>

      <h1 className="title">Baksteen Game </h1>

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
              &#9655;
            </button>
          </div>
        </form>
      )}

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
        <div className="create-code">
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
              &#9655;
            </button>
          </div>
        </form>
      )}

      {mode === "checkingCode" && (
        <h1 className="create-code">checking code</h1>
      )}
      {mode === "codeAccepted" && <Navigate to="/game" />}
    </div>
  );
}

export default Start;
