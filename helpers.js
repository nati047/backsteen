canvasWidth = 500;
canvasHeight = 500;

// const bounce = (paddle, ball, player, state, room) => {

//   if (ball.x + ball.dx > canvasWidth - ball.radius || ball.x + ball.dx < ball.radius) {
//     ball.dx = - ball.dx;
//   }
//   if (ball.y + ball.radius >= canvasHeight - paddle.height && (ball.x >= paddle.x && ball.x <= paddle.x + paddle.width) || ball.y <= ball.radius) {
//     ball.dy = -ball.dy;
//     if((ball.x >= paddle.x && ball.x <= paddle.x + paddle.width) && (ball.y + ball.radius >= canvasHeight - paddle.height) && !player.gamePause) {
//       io.in(room).emit('paddleHit');
//     }
//   } else if (ball.y + ball.radius > canvasHeight - paddle.height && !(ball.x > paddle.x && ball.x < paddle.x + paddle.width)) {
//     reset(paddle, ball, player, state);
//     // ball.dy = -ball.dy; // @TODO fix this 
//   }
// };

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

// const  collision = (brick, ball, player, room, io) => {
//   for (let i = 0; i < brick.columns; i++) {
//     for (let v = 0; v < brick.rows; v++) {
//       const b = brick.bricks[i][v];
//       if (b.status == 1) {
//         if (
//           ball.x  > b.x &&
//           ball.x  < b.x + brick.width &&
//           ball.y - ball.radius > b.y &&
//           ball.y - ball.radius < b.y + brick.height
//         ) {
//           ball.dy = -ball.dy;
//           b.status = 0;
//           io.in(room).emit('brickHit');
//           player.score += 100;
//         }
//       }
//     }
//   }
// };

const updateGame = (ball, bricks, state, paddle, player, room) => {
  ball.update();
  collision(bricks, ball, player, room);
  bounce(paddle, ball, player, state, room);
  noBricks(player, state, bricks);
  // reset(paddle,ball, player)
};

 module.exports = {updateGame, reset }; 

  