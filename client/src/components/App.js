import "./Game.css";
import Canvas from "./Canvas";
import Start from "./Start";
import Leaders from "./Leaders";
import Controls from "./Controls";
import socketIoClient from "socket.io-client";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const END_POINT = "https://backsteen.herokuapp.com/" || process.env.REACT_APP_BACK_END_POINT;
const socket = socketIoClient(END_POINT); // connection to backend


function App() {
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
