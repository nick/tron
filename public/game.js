Game = function(cfg) {
    this.run = true;
    this.multiplier = cfg.multiplier || 2;
    this.players = {};
    this.totalPlayers = 0;
    
    this.newCanvas();
    this.colorIdx = 0;
    
    this.playerColors = ['red', 'blue', 'green', 'black', 'orange', 'purple', 'yellow'];
}

Game.prototype.getColor = function() {
    this.colorIdx = this.colorIdx + 1;
    return this.playerColors[this.colorIdx % this.playerColors.length];
};

Game.prototype.newCanvas = function() {
    
    if (this.canvas) document.body.removeChild(this.canvas);
    
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('width', 500);
    this.canvas.setAttribute('height', 300);
    this.canvas.style.border = "1px solid black";

    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = 'bold 30px sans-serif';
};

Game.prototype.reset = function() {

    var y = 0;
    for(var playerID in this.players) {
        this.players[playerID].reset();        
        y = y + 50;
        this.players[playerID].y = y;
    }
    
    this.resetting = false;
    this.newCanvas();
    this.start();
    
    return true;
}

Game.prototype.start = function() {
    
    console.log("Starting game...")
    
    this.run = true;
    this.nextFrame();
    return true;
}

Game.prototype.collision = function(playerName) {
    this.ctx.strokeStyle = '#f00';
    this.ctx.strokeText(playerName + ' died :(', 170, 140);
    
    this.run = false;
    var thisGame = this;
    
    this.resetting = true;

    setTimeout(function() {
        if(thisGame.resetting) {
            thisGame.reset();            
        }
    }, 2000);
}

Game.prototype.addPlayer = function(playerID, playerCfg) {
    console.log("Adding player " + playerID);
    this.totalPlayers = this.totalPlayers + 1;
    
    var player = new Player(this, playerCfg);
    player.color = this.getColor();
    this.players[playerID] = player;

}

Game.prototype.removePlayer = function(playerID) {
    console.log("Removing player " + playerID);
    delete this.players[playerID];
    this.totalPlayers = this.totalPlayers - 1;
}

Game.prototype.move = function(playerID, direction) {
    if (direction == 'up') this.players[playerID].turnUp();
    else if (direction == 'down') this.players[playerID].turnDown();
    else if (direction == 'left') this.players[playerID].turnLeft();
    else if (direction == 'right') this.players[playerID].turnRight();
}

Game.prototype.nextFrame = function() {
    
    for(var playerID in this.players) {
        var player = this.players[playerID];
        
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