import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import "./Style.css";
import logo from "../brick.png";
import gameBg from "../gameBg.png";

function Start({ socket }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [mode, setMode] = useState("");
  const [randomCode, setRandomCode] = useState("");

  const handleSubmit = () => {
    if (name) {
      setMode("gotName");
    }
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
    <div className="main-div">
      <img class="game-img" src={gameBg} />
      <h3 className="title">Baksteen</h3>

      {mode === "" && (
        <div className="start-page">

          {/* <img className="image" src={logo} alt="logo" /> */}
          <form className="name-form" onSubmit={handleSubmit}>
            {/* <div className="lNi"> */}
              <label className="labelin">
                who can we call you?
              </label>
              <input
                className="name-input"
                value={name}
                type="text"
                onChange={handleNameChange}
                placeholder="name"
              />
              <button className="paly-button" type="submit">
                play
              </button>
            {/* </div> */}
          </form>
          <Link to="/controls">
            <p >How to play</p>
          </Link>
          <Link to="/leaders">
            <p className="leaders">Leaderboard</p>
          </Link>
        </div>
      )}

      {mode === "gotName" && (
        <div className="cNj">
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
          <h5>copy game code and send to a friend</h5>
          <h1> game code : {randomCode}</h1>
          <h5 className="waiting">waiting for other player to join...</h5>
        </div>
      )}
      {mode === "join" && (
        <form className="join-form" onSubmit={handleCodeSubmit}>
          <div>
            <label className="label-join">Input game code</label>
          </div>

          <input
            className="label-input"
            value={code}
            type="text"
            onChange={handleCodeChange}
            placeholder="code"
          />
            <button className="button" type="submit">
              start
            </button>
        </form>
      )}

      {mode === "checkingCode" && (
        <h1 className="create-code">checking code...</h1>
      )}
      {mode === "codeAccepted" && <Navigate to="/game" />}
    </div>
  );
}

export default Start;
