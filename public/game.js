Game = function(cfg) {
    this.run = true;
    this.multiplier = cfg.multiplier || 2;
    this.players = [];
    this.newCanvas();
}

Game.prototype.newCanvas = function() {
    
    if (this.canvas) document.body.removeChild(this.canvas);
    
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('width',500);
    this.canvas.setAttribute('height',300);
    this.canvas.style.border = "1px solid black";

    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = 'bold 30px sans-serif';
};

Game.prototype.reset = function() {

    for(var p=0; p< this.players.length; p++) {
        this.players[p].reset();
    }
    
    this.newCanvas();
    this.start();
    
    return true;
}

Game.prototype.start = function() {
    console.log("start game")
    this.run = true;
    this.nextFrame();
    return true;
}

Game.prototype.collision = function(playerName) {
    this.ctx.strokeStyle = '#f00';
    this.ctx.strokeText(playerName + ' died :(', 170, 140);
    
    this.run = false;
    var thisGame = this;

    setTimeout(function() {
        thisGame.reset();
    }, 2000);
}

Game.prototype.addPlayer = function(playerCfg) {
    this.players.push(new Player(this, playerCfg));
    return true;
}

Game.prototype.key = function(keyCode) {
    if (keyCode == 37) { // Left
        this.players[0].turnLeft();
    } else if (keyCode == 38) { // Up
        this.players[0].turnUp();
    } else if (keyCode == 39) { // Right
        this.players[0].turnRight();
    } else if (keyCode == 40) { // Down
        this.players[0].turnDown();
    } else if (keyCode == 27) { // Down
        this.run = false;
    } else if (keyCode == 65) { // Left
        this.players[1].turnLeft();
    } else if (keyCode == 87) { // Up
        this.players[1].turnUp();
    } else if (keyCode == 68) { // Right
        this.players[1].turnRight();
    } else if (keyCode == 83) { // Down
        this.players[1].turnDown();
    }
}

Game.prototype.move = function(playerID, direction) {
    if (direction == 'up') this.players[playerID].turnUp()
    else if (direction == 'down') this.players[playerID].turnDown()
    else if (direction == 'left') this.players[playerID].turnLeft()
    else if (direction == 'right') this.players[playerID].turnRight()
}

Game.prototype.nextFrame = function() {
      for (var p=0; p< this.players.length; p++) {

          var player = this.players[p];

          player.hasCollided();

          this.ctx.beginPath();
          this.ctx.strokeStyle = player.color;
          this.ctx.moveTo(player.x, player.y);
          this.ctx.lineTo(player.nextX(), player.nextY());
          this.ctx.stroke();
      }

      if (this.run) {
          var thisGame = this;
          setTimeout(function() {
              thisGame.nextFrame()
          }, 10);
      }
}