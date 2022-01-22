const PORT = 8080;
const express = require("express");

const socketio = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const rooms = {};
// canvas
canvasWidth = 600;
canvasHeight = 600;

class Ball {
  constructor() {
    this.x = 150;
    this.y = 300;
    this.radius = 10;
    this.dx = 5;
    this.dy = -5;
  }
  update  () {
    this.x += this.dx;
    this.y += this.dy;
  } 
  
};

class Paddle {
  constructor () {
    this.x = 100;
    this.width = 100;
    this.height = 10;
  }
  update (direction, canvasWidth) {
    if(direction === 'left') 
      this.x -= 10;
    if(direction === 'right') 
      this.x += 10;
    if(this.x < 0) 
      this.x = 0;
    if(this.x + this.width > canvasWidth) 
      this.x = canvasWidth - this.width; 
  }
}

class Bricks {
  constructor() {
    this.bricks = [];
    this.columns = 9;
    this.rows = 5;
    this.height = 20;
    this.width = 75;
    this.padding = 2;
    this.OffsetTop = 30;
    this.OffsetLeft = 0;
  }
  fillBricks () {
    
    for (let i = 0; i < this.columns; i++) {
      this.bricks[i] = [];
      for (let v = 0; v < this.rows; v++) {
        this.bricks[i][v] = { x: 0, y: 0, status: 1 };
        this.bricks[i][v].x = i * (this.width + this.padding) + this.OffsetLeft;
        this.bricks[i][v].y  = v * (this.height + this.padding) + this.OffsetTop;
          
      }
    }
  };
  
};
const ball1 = new Ball;
const paddle1 = new Paddle;
const bricks1 = new Bricks;
bricks1.fillBricks(); 

const ball2 = new Ball;
const paddle2 = new Paddle;
const bricks2 = new Bricks;
bricks2.fillBricks(); 

const state = {
  player1: {
    name: '',
    win: false,
    score: 0,
    lives: 2,
    gamePause: false,
  },
  player2: {
    name: '',
    win: false,
    score: 0,
    lives: 3,
    gamePause: false,
  },
  gameOver: false,
  ball1,
  paddle1,
  bricks1,
  ball2,
  paddle2,
  bricks2
}

function collision(brick, ball) {
  for (let i = 0; i < brick.columns; i++) {
    for (let v = 0; v < brick.rows; v++) {
      const b = brick.bricks[i][v];
      if (b.status == 1) {
        if (
          ball.x > b.x &&
          ball.x < b.x + brick.width &&
          ball.y > b.y &&
          ball.y < b.y + brick.height
        ) {
          ball.dy = -ball.dy;
          b.status = 0;
        }
      }
    }
  }
};
const reset = (paddle, ball, player) =>{
  player.gamePause = true
  ball.x = paddle.x + paddle.width / 2;
  ball.y = canvasWidth - paddle.height - ball.radius - 1;
  
  const timeOut = setTimeout(() => {
    player.gamePause = false;
  }, 1000);

}
const bounce = (paddle, ball, player) => {
  
  if (ball.x + ball.dx > canvasWidth - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = - ball.dx;
  }
  if (ball.y + ball.radius  >= canvasHeight - paddle.height && (ball.x >= paddle.x && ball.x <= paddle.x + paddle.width) || ball.y  <= ball.radius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.radius  > canvasHeight - paddle.height && !(ball.x > paddle.x && ball.x < paddle.x + paddle.width) ){
    reset(paddle, ball, player);
    // ball.dy = -ball.dy; // @TODO fix this 
  }
};

const startGame1 = () => {
  ball1.update();
  collision(bricks1, ball1);
  bounce(paddle1, ball1, state.player1);
};

const startGame2 = () => {
  ball2.update();
  collision(bricks2, ball2);
  bounce(paddle2, ball2, state.player2);
};

// const gameInterval = setInterval(() => {
//   startGame();
// }, 1000);



io.on("connection", (socket)=>{
  console.log("socket connected", socket.id)

  setInterval(() => {
    if (!state.player1.gamePause) startGame1();
    if (!state.player2.gamePause) startGame2();
    socket.emit('gameState',  state );
  }, 100);

  // socket.on('keyDown', msg => { // move paddle depending on socket where keypress event originated
  //   if(socket.id === room[0] && msg.key === "ArrowRight") paddle1.update("right", canvasWidth);
  //   if(socket.id === room[0] && msg.key === "ArrowLeft") paddle1.update("left", canvasWidth); 
    
  //   if(socket.id === room[1] && msg.key === "ArrowRight") paddle2.update("right", canvasWidth);
  //   if(socket.id === room[1] && msg.key === "ArrowLeft") paddle2.update("left", canvasWidth);
  // });

  // socket.join('room', () =>{
  //   room.push(socket.id)
  //   console.log(room)
  // })
  socket.on("createGame", (msg) =>{
    console.log("game started by: ",socket.id)
    console.log("game code ",msg)
    rooms[msg.code] = [socket.id];
    socket.join(`${msg.code}`, () =>{
      console.log('rooms', rooms);
    })
  });

  socket.on('checkCode', (code) =>{
    console.log("code from joiner",code);
    if (rooms[code]) {
      console.log('room exists');
      if(rooms[code].length === 1) {
      rooms[code].push(socket.id);
      socket.join(`${code}`, () => console.log('joined game'));
      console.log('rooms after joined', rooms);
      io.in(`${code}`).emit('matched')
      }
    }  
  })
});


server.listen(PORT, () =>{
  console.log('Connected');
}) 



