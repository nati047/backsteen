import './App.css';
import Canvas from './Canvas';
import Start from './Start';
import socketIoClient from "socket.io-client";
import React, { useRef ,useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const END_POINT = "http://localhost:8080"
const connection = socketIoClient(END_POINT); // connection to backend

function App() {
// / socket io stuff  /////////////////////////////////////////////////////////////////////
//   useEffect(() =>{
//     connection.emit('choice', { choice: option, id })
//   }, [option]); 

// useEffect(() =>{
//     connection.on("initial", msg => {
//       setid(` ${msg.idNum}`);
//       setConn(msg.connectedUsersCount)
//     });  
//   }, []);
 
  return (
    <Router>
      <Routes>
        <Route path="/game" element={<Canvas connection= {connection}/>} />
        <Route path="/" exact element={<Start />} />
    </Routes>
  </Router> 
    
  );
}

export default App;


