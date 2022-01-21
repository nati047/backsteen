import './App.css';
import socketIoClient from "socket.io-client";
import React, { useRef, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Canvas({ option, connection }) {
  const canvasRef = useRef();
  const canvas2Ref = useRef();
  let gameState;
  const canvasWidth = 600;
  const canvasHeight = 600;

  // ball
  

  function drawBricks(ctx, brick) {
    for (let i = 0; i < brick.columns; i++) {
      for (let v = 0; v < brick.rows; v++) {
        if (brick.bricks[i][v].status == 1) {
          ctx.beginPath();
          ctx.rect(brick.bricks[i][v].x, brick.bricks[i][v].y, brick.width, brick.height);
          ctx.fillStyle = "#DC143C";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  };




  useEffect(() => {
  
////////////////  canvas //////////////
    const canvas1 = canvasRef.current;
    const canvas2 = canvas2Ref.current;
    canvas1.width = 600;
    canvas1.height = 600;
    canvas2.width = 600;
    canvas2.height = 600;
    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
///////////////////////////////////////////////
    connection.on('gameState', data =>{
      ctx1.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx2.clearRect(0, 0, canvasWidth, canvasHeight);
      drawGame1(data, ctx1);
      drawGame2(data, ctx2);
    })  

    function drawPaddle(ctx, paddle) {
      ctx.beginPath();
      ctx.rect(paddle.x, canvasHeight - paddle.height, paddle.width, paddle.height);
      ctx.fillStyle = "#0000ff";
      ctx.fill();
      ctx.closePath();
    }

     function drawBall (ctx, ball) {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
     }
   
    
    function drawGame1(data, ctx) {
      drawBall(ctx, data.ball1 );
      drawPaddle(ctx, data.paddle1);
      drawBricks(ctx, data.bricks1);
    };

    function drawGame2(data, ctx) {
      drawBall(ctx, data.ball2 );
      drawPaddle(ctx, data.paddle2);
      drawBricks(ctx, data.bricks2);
    };
    // drawGame();

    // connection.on('gameOver', handleGameover)
    // connection.emmit('noMoreBricks)
  }, [])
  document.addEventListener('keydown', (e) =>{
    connection.emit('keyDown', {key: e.key});
  })
  return (

    < div className='board'>
      <canvas ref={canvasRef} className='left-canvas' ></canvas>
      <canvas ref={canvas2Ref} className='right-canvas'  ></canvas>
    </div>

  );
}

export default Canvas;
