var connect = require('connect'),
    express = require('express'),
    http = require('http'),
    io = require('socket.io');

var app = express.createServer(
    connect.static(__dirname + '/public')
);

app.get('/', function(req, res){
    res.render('start.ejs');
});

app.get('/tron', function(req, res){
    res.render('tron.ejs', { layout: false });
});

app.get('/player', function(req, res){
    res.render('controls.ejs', {
        layout: false,
        player: req.query.player,
        playerName: req.query.name
    });
});

app.listen(3000);

var socket = io.listen(app);

var tronScreen;
var playerSessions = {
};

socket.on('connection', function(client){
    client.on('connect', function() {
        console.log(client.sessionId + " connected")
    });
    client.on('message', function(msg){
        console.log(client.sessionId)
        console.log("Msg", msg)

        var newPlayerMatch = msg.match('^new player (p[0-9]+)');
        if(newPlayerMatch) {
            playerSessions['s' + client.sessionId] = newPlayerMatch[1];
            console.log(playerSessions)
        }

        if(msg == 'GAME') {
            tronScreen = client;
        } else if(tronScreen && msg) {
            tronScreen.send(msg);
        }
    });
    client.on('disconnect', function(){
        if(tronScreen && playerSessions['s' + client.sessionId]) {
            var msg = 'disconnect: ' + playerSessions['s' + client.sessionId];
            console.log("SEND " + msg)
            tronScreen.send(msg);
        }
        delete playerSessions['s' + client.sessionId];
        console.log(client.sessionId + " disconnected", playerSessions, client.sessionId)
    });
});
