import React from "react";
import "./components/styles.scss";
import loginImg from "./main.svg";

function Start() {
  return (
    <div className="App">
      <div className="base-container">
        <div className="header">Brick Game</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} />
          </div>
          <div className="form">
            <label htmlFor="username">UserName</label>
            <div>
              <input type="text" name="username" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

 export default Start;


