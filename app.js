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
        player: req.query.player
    });
});

app.listen(3000);

var socket = io.listen(app);

var tronScreen;
var players = {

};

socket.on('connection', function(client){
    client.on('message', function(msg){

        console.log("Msg", msg)
        if(msg == 'GAME') {
            tronScreen = client;
        // } else if(msg == 'NEW PLAYER') {
        //     tronScreen.send(msg);
        } else if(tronScreen && msg) {
            tronScreen.send(msg);
        }
    });
    client.on('disconnect', function(){
        console.log("Disconnect")
    });
});
