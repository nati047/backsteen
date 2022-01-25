import "./Game.css";
import Canvas from "./Canvas";
import Start from "./Start";
import Leaders from "./Leaders";
import Controls from "./Controls";
import socketIoClient from "socket.io-client";
import React, { useRef, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Howl } from "howler";
import music from "../gameMusic.mp3";

const END_POINT = process.env.REACT_APP_BACK_END_POINT;
const socket = socketIoClient(END_POINT); // connection to backend
// const sound = new Howl({
//   src: music,
//   html5: true
// });

function App() {
  // useEffect(() =>{
  //   sound.volume = 10;
  //   sound.loop = true;
  //   sound.play();
  //   console.log("hiiii")

  // }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/game" element={<Canvas socket={socket} />} />
        <Route path="/leaders" element={<Leaders />} />
        <Route path="/controls" element={<Controls />} />
        <Route path="/" element={<Start socket={socket} />} />
      </Routes>
    </Router>
  );
}

export default App;
