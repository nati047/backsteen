const PORT = process.env.PORT || 8081;
const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server);

const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://nati:WuX3NF5mghh8ncxh@cluster0.8k9zf.mongodb.net/brick_breaker?retryWrites=true&w=majority";

const {Ball, Paddle, Bricks} = require('./elements');

function addToDatabase (obj) {
  
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("brick_breaker");
    const myobj = obj;
    dbo.collection("scores").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });

}; 

const rooms = {};

canvasWidth = 500;
canvasHeight = 500;

const  collision = (brick, ball, player, room) => {
  for (let i = 0; i < brick.columns; i++) {
    for (let v = 0; v < brick.rows; v++) {
      const b = brick.bricks[i][v];
      if (b.status == 1) {
        if (
          ball.x  > b.x &&
          ball.x  < b.x + brick.width &&
          ball.y - ball.radius > b.y &&
          ball.y - ball.radius < b.y + brick.height
        ) {
          ball.dy = -ball.dy;
          b.status = 0;
          io.in(room).emit('brickHit');
          player.score += 100;
        }
      }
    }
  }
};

const reset = (paddle, ball, player, state) => {
    player.gamePause = true;
    player.lives -= 1;
    if (player.lives > 0) {
      ball.x = paddle.x + paddle.width / 2;
      ball.y = canvasWidth - paddle.height - ball.radius - 1.5;
  
      const timeOut = setTimeout(() => {
        player.gamePause = false;
      }, 500);
    } else {
        state.gameOver = true;
        player.lose = true;
    }
};



const bounce = (paddle, ball, player, state, room) => {

  if (ball.x + ball.dx > canvasWidth - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = - ball.dx;
  }
  if (ball.y + ball.radius >= canvasHeight - paddle.height && (ball.x >= paddle.x && ball.x <= paddle.x + paddle.width) || ball.y <= ball.radius) {
    ball.dy = -ball.dy;
    if((ball.x >= paddle.x && ball.x <= paddle.x + paddle.width) && (ball.y + ball.radius >= canvasHeight - paddle.height) && !player.gamePause) {
      io.in(room).emit('paddleHit');
    }
  } else if (ball.y + ball.radius > canvasHeight - paddle.height && !(ball.x > paddle.x && ball.x < paddle.x + paddle.width)) {
    reset(paddle, ball, player, state);
  }
};

const noBricks = (player, state, brick) => {
  for (let i = 0; i < brick.columns; i++) {
    for (let v = 0; v < brick.rows; v++) {
      const b = brick.bricks[i][v];
      if (b.status == 1) {
       return ;
      }
    }
  }
  state.gameOver = true;
  player.win = true;
}

const updateGame = (ball, bricks, state, paddle, player, room) => {
  ball.update();
  collision(bricks, ball, player, room);
  bounce(paddle, ball, player, state, room);
  noBricks(player, state, bricks);
};

io.on("connection", (socket) => {
  console.log("socket connected", socket.id)
  socket.on("createGame", (msg) => {

    rooms[msg.code] = {
      players: [],
      playerNames: [],
      state: {}
    };
    rooms[msg.code].players.push(socket.id);
    rooms[msg.code].playerNames.push(msg.name);
    socket.join(`${msg.code}`, () => {
    })
  });

  socket.on('checkCode', (msg) => {
    if (rooms[msg.code]) {
      if (rooms[msg.code].players.length === 1) {
        rooms[msg.code].players.push(socket.id);
        rooms[msg.code].playerNames.push(msg.name);
        socket.join(`${msg.code}`, () => {
          runGame(msg.code);
        });
        io.in(`${msg.code}`).emit('matched');
      }
    }
    else {
      socket.emit('wrongCode');
    }
  });

  const runGame = (code) => {

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
        name: rooms[code].playerNames[0],
        lose: false,
        win: false,
        score: 0,
        lives: 5,
        gamePause: false,
      },
      player2: {
        name: rooms[code].playerNames[1],
        lose: false,
        win: false,
        score: 0,
        lives: 5,
        gamePause: false,
      },
      gameOver: false,
      ball1,
      paddle1,
      bricks1,
      ball2,
      paddle2,
      bricks2
    };
    rooms[code].state = state;
    const gameInterval = setInterval(() => {
      if (!state.player1.gamePause) updateGame(ball1, bricks1, state, paddle1, state.player1, code);
      if (!state.player2.gamePause) updateGame(ball2, bricks2, state, paddle2, state.player2, code);
      if (!state.gameOver) {
        io.in(code).emit('gameState', { state, roomName: code });   // send game info to a room 
      } 
      else {  // when game is over 
        let winner;
        if (state.player1.lose || state.player2.win) {
          winner = state.player2
        } else {
          winner = state.player1
        }
        clearInterval(gameInterval);
        io.in(code).emit('gameOver', { winner: winner.name, score: winner.score });
        addToDatabase({name: winner.name, score: winner.score });
      }

    }, 1000 / 60);

  };

  socket.on('keyDown', msg => { // move paddle depending on socket where keypress event originated
    if(rooms[msg.roomName]) {
      if(!rooms[msg.roomName].state.player1.gamePause){
        if (socket.id === rooms[msg.roomName].players[0] && msg.key === "ArrowRight") rooms[msg.roomName].state.paddle1.update("right", canvasWidth);
        if (socket.id === rooms[msg.roomName].players[0] && msg.key === "ArrowLeft") rooms[msg.roomName].state.paddle1.update("left", canvasWidth);
      }
      if(!rooms[msg.roomName].state.player2.gamePause){
        if (socket.id === rooms[msg.roomName].players[1] && msg.key === "ArrowRight") rooms[msg.roomName].state.paddle2.update("right", canvasWidth);
        if (socket.id === rooms[msg.roomName].players[1] && msg.key === "ArrowLeft") rooms[msg.roomName].state.paddle2.update("left", canvasWidth);
      }
    }
  });
  
  socket.on('restart', roomName => {
    if(rooms[roomName] && rooms[roomName].state.gameOver) { 
     runGame(roomName);
    }
  });

});

app.get("/db", (req, res) => {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("brick_breaker");
    dbo.collection("scores").find().sort( { "score": -1 } ).toArray(function(err, result) {
      if (err) throw err;
        res.send(result);
      db.close();
    });
  });
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build'));
});

server.listen(PORT, () => {
  console.log('Connected on port', PORT);
})


