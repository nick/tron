Player = function(game, cfg) {
    this.game = game;
    this.startX = cfg.x || 50;
    this.startY = cfg.y || 50;
    this.x = cfg.x || 50;
    this.name = cfg.name;
    this.y = cfg.y || 50;
    this.deltaX = 1;
    this.deltaY = 0;
    this.multiplier = game.multiplier;
    this.color = cfg.color;
};

Player.prototype = {
    nextX: function() {
        this.x = this.x + (this.deltaX * this.multiplier);
        return this.x;
    },

    nextY: function() {
        this.y = this.y + (this.deltaY * this.multiplier);
        return this.y;
    },

    turnLeft: function() {
        if (this.deltaX == 1) return false;
        this.deltaX = -1;
        this.deltaY = 0;
        return true;
    },

    turnRight: function() {
        if (this.deltaX == -1) return false;
        this.deltaX = 1;
        this.deltaY = 0;
        return true;
    },

    turnUp: function() {
        if (this.deltaY == 1) return false;
        this.deltaX = 0;
        this.deltaY = -1;
        return true;
    },

    turnDown: function() {
        if (this.deltaY == -1) return false;
        this.deltaX = 0;
        this.deltaY = 1;
        return true;
    },
    
    reset: function() {
        this.x = this.startX;
        this.y = this.startY;
        this.deltaX = 1;
        this.deltaY = 0;
    },

    hasCollided: function() {

        var collission = false;

        // Check if we're out of screen bounds
        if (this.x <= 0 || this.x >= 500 || this.y <= 0 || this.y >= 300) {
            collission = true;
        } else {
            // If the pixel in front is anything but white, we've collided.
            var imgd = this.game.ctx.getImageData(
                this.x + this.deltaX,
                this.y + this.deltaY,
                (this.deltaX == 0 ? 1 : this.deltaX * this.multiplier),
                (this.deltaY == 0 ? 1 : this.deltaY * this.multiplier)
            );

            for (var i=0; i< imgd.data.length; i++) {
                if(imgd.data[i] != 0) collission = true;
            }
        }

        if (collission) {
            this.game.collision(this.name)
        }
    }
};
