class Ball {
  constructor() {
    this.x = 150;
    this.y = 300;
    this.radius = 8;
    this.dx = 3;
    this.dy = -5;
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
  }

};

class Paddle {
  constructor() {
    this.x = 100;
    this.width = 100;
    this.height = 10;
  }
  update(direction, canvasWidth) {
    if (direction === 'left')
      this.x -= 17.5;
    if (direction === 'right')
      this.x += 17.5;
    if (this.x < 0)
      this.x = 0;
    if (this.x + this.width > canvasWidth)
      this.x = canvasWidth - this.width;
  }
}

class Bricks {
  constructor() {
    this.bricks = [];
    this.columns = 18;
    this.rows = 10;
    this.height = 10;
    this.width = 37.5;
    this.padding = 2;
    this.OffsetTop = 30;
    this.OffsetLeft = 0;
  }

  fillBricks() {
    for (let i = 0; i < this.columns; i++) {
      this.bricks[i] = [];
      for (let v = 0; v < this.rows; v++) {
        this.bricks[i][v] = { x: 0, y: 0, status: 1 };
        this.bricks[i][v].x = i * (this.width + this.padding) + this.OffsetLeft;
        this.bricks[i][v].y = v * (this.height + this.padding) + this.OffsetTop;
      }
    }
  };
};

module.exports = {Ball, Paddle, Bricks}