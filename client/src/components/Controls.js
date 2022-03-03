import React from "react";
import { Link } from "react-router-dom";
import "./Style.css";
function Controls() {
  return (
    <div>
      <h1 className="control-h1">how to play the game</h1>
      <p className="control-p">
        In this game, the player moves a PADDLE side-to-side using the left
        and the right arrows to hit the BALL. The game’s objective is to eliminate
        all of the BRICKS at the top of the screen by hitting them with the
        BALL. But, if the ball hits the bottom ENCLOSURE more than 5 times, the player loses and
        the game ends! To win the game, all the BRICKS must be eliminated.
      </p>
      <h3 className="control-p">Good luck</h3>
      <Link to="/">
        <h3 className="control-back">&#9665;</h3>
      </Link>
    </div>
  );
}

export default Controls;
