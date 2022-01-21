import './App.css';
import Canvas from './Canvas';
import Start from './Start';
import Leaders from './Leaders';
import Controls from './Controls'
import socketIoClient from "socket.io-client";
import React, { useRef ,useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const END_POINT = "http://localhost:8080"
const socket = socketIoClient(END_POINT); // connection to backend

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/game" element={<Canvas socket= {socket}/>} />
        <Route path="/leaders"  element={<Leaders />} />
        <Route path="/controls"  element={<Controls />} />
        <Route path="/"  element={<Start socket= {socket}/>} />
      </Routes>
    </Router> 
  );
};
    
export default App;


