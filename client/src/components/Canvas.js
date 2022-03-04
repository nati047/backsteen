import './Game.css';
import React, { useRef, useEffect } from "react";
import {  Link } from "react-router-dom";
import { Howl } from "howler";
import paddleHit from "../paddleHit.mp3";
import brickHit from "../brickSound.mp3";

function Canvas({ socket }) {
  const canvasRef = useRef();
  const canvas2Ref = useRef();
  const scoreCanvasRef = useRef();
  const canvasWidth = 500;
  const canvasHeight = 500;
  let roomName;
  // ball
  const paddleSound = new Howl({
    src: paddleHit,
    html5: true
  });

  const brickSound = new Howl({
    src: brickHit,
    html5: true
  });

  const drawBricks = (ctx, brick) => {
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

  const drawScore = (ctx, canvas, state) => {

    ctx.font = "40px bungee";
    ctx.fillStyle = 'black';
    ctx.fillText(state.player1.name, canvas.width / 2 - 160, 50);

    ctx.font = "40px bungee";
    ctx.fillText(state.player2.name, canvas.width / 2 + 25, 50);
    // player 1 score
    ctx.font = "60 bungee";
    ctx.fillText(state.player1.score, canvas.width / 4 - 50, canvas.height / 2);
    // player 2 score
    ctx.font = "60 bungee";
    ctx.fillText(state.player2.score, canvas.width * 3 / 4 - 50, canvas.height / 2);

    //line
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.moveTo(canvas.width / 2, 20);
    ctx.lineTo(canvas.width / 2, canvas.height - 20);
    ctx.strokeStyle = "black"
    ctx.stroke();
    ctx.closePath();
    // player 1 lives
    if (state.player1.lives > 0) {
      for (let x = 0; x < state.player1.lives; x++) {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(20 * x + 50, 50, 7.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    }
    // player 2 lives
    if (state.player1.lives > 0) {
      for (let x = 0; x < state.player2.lives; x++) {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(950 - 20 * x, 50, 7.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    }

  };

  useEffect(() => {

    ////////////////  canvas //////////////
    const canvas1 = canvasRef.current;
    const canvas2 = canvas2Ref.current;
    const scoreCanvas = scoreCanvasRef.current;
    canvas1.width = canvasWidth;
    canvas1.height = canvasHeight;
    canvas2.width = canvasWidth;
    canvas2.height = canvasHeight;
    scoreCanvas.width = 1002;
    scoreCanvas.height = 200;
    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
    const ctx3 = scoreCanvas.getContext('2d');
    // draw elements on canvas
    const drawPaddle = (ctx, paddle) => {
      ctx.beginPath();
      ctx.rect(paddle.x, canvasHeight - paddle.height, paddle.width, paddle.height);
      ctx.fillStyle = "#0357ff";
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#0bff03';
      ctx.stroke(); 
      ctx.closePath();
    }

    const drawBall = (ctx, ball) => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
    }

    const drawGame1 = (data, ctx) => {
      drawBall(ctx, data.ball1);
      drawPaddle(ctx, data.paddle1);
      drawBricks(ctx, data.bricks1);
    };

    const drawGame2 = (data, ctx) => {
      drawBall(ctx, data.ball2);
      drawPaddle(ctx, data.paddle2);
      drawBricks(ctx, data.bricks2);
    };

    const drawGameOver = (data, ctx, canvas) => {
      ctx.fillStyle = 'black';
      ctx.font = "30px bungee";
      ctx.fillText("Game Over", canvas.width / 2 - 160, 50);
      ctx.font = "60px bungee";
      ctx.fillText(`${data.winner} Wins 🏆`, canvas.width / 2 - 250, 100);
      ctx.font = "40px bungee";
      ctx.fillText(`Score: ${data.score}`, canvas.width / 2 - 160, 150);
    };

    socket.on('gameState', data => {  //recieve game data sent from server
      roomName = data.roomName;
      ctx1.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx2.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx3.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
      drawGame1(data.state, ctx1);
      drawGame2(data.state, ctx2);
      drawScore(ctx3, scoreCanvas, data.state);
    });

    socket.on('gameOver', data => {
      ctx3.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
      drawGameOver(data, ctx3, scoreCanvas);
    });

    socket.on('paddleHit', () => {
      paddleSound.play();
    });

    socket.on('brickHit', () => {
      brickSound.play();
    });

  }, []);

  document.addEventListener('keydown', (e) => {
    socket.emit('keyDown', { key: e.key, roomName });
  });

  const handleRestart = () => {
    socket.emit('restart', roomName);
  };

  return (
    <div className="main-container">
      <div className="n-or-h">
        <button className="restart-btn" onClick={handleRestart}>New Game</button>
        <Link className="home-link" to="/" > Home </Link>
      </div>
      <div className="score-board">
        <canvas ref={scoreCanvasRef} className='score-canvas' ></canvas>
      </div>

      <div className='board'>
        <div className="lc">
          <canvas ref={canvasRef} className='left-canvas' ></canvas>
        </div>
        <canvas ref={canvas2Ref} className='right-canvas'  ></canvas>
      </div>
    </div>
  );
}

export default Canvas;

