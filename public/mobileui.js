var randomPlayerID = 'p' + (Math.ceil(Math.random() * 10000000000) + 10000000000);
var socket = new io.Socket();

socket.on('connect', function(){ 
    console.log('connected')
    socket.send('new player ' + randomPlayerID + ': ' + gameState.playerName);
});
socket.on('message', function(){ console.log('message') })
socket.on('disconnect', function(){ console.log('disconnect') })

// document.onkeydown = function(e) {
//     var direction;
//     if (e.keyCode == 37) { // Left
//         direction = 'left';
//     } else if (e.keyCode == 38) { // Up
//         direction = 'up';
//     } else if (e.keyCode == 39) { // Right
//         direction = 'right';
//     } else if (e.keyCode == 40) { // Down
//         direction = 'down';
//     }
//     var str = 'player ' + randomPlayerID + ': ' + direction;
//     // console.log(str);
//     socket.send(str);
// }

Ext.ns('Tron');

var gameState = {};

Ext.setup({
    phoneStartupScreen: 'startup.png',
    icon: 'icon.png',
    glossOnIcon: false,
    
    onReady: function() {
        var app = new Tron.App();
        Tron.app = app;

    }
});


Ext.regModel('Players', {
    fields: ['name', 'id']
});

var store = new Ext.data.JsonStore({
    model  : 'Players',
    sorters: 'name',

    data: [
        {name: 'player1',   id: 1},
        {name: 'player2',   id: 2},
        {name: 'player3',   id: 3}
    ]
});

Tron.defaultAnim = Ext.is.Android ? false : 'slide';
Tron.App = Ext.extend(Ext.Panel, {
    cls: 'app',
    fullscreen: true,
    layout: 'card',
    activeItem: 0,
    
    initComponent: function() {
    
    	function gameRemoteHandler(direction) {
    		console.log('MOVE ' + direction);
    		var str = 'player ' + randomPlayerID + ': ' + direction;
            // console.log(str);
            socket.send(str);
    	}
    
		var gameControls = [
			new Ext.Button({
				ui: 'round',
				text: 'Up',
				padding: 50,
				handler: function() {
                    gameRemoteHandler('up')
                }                
			}),
			new Ext.Container({
				layout: 'hbox',
				items: [
					new Ext.Button({
						ui: 'round',
						text: 'Left',
						padding: 50,
                        handler: function() {
                            gameRemoteHandler('left')
                        }
					}),
					{padding: 50},
					new Ext.Button({
						ui: 'round',
						text: 'Riht',
						//html: '<img src="http://www.psdgraphics.com/file/right-arrow-icon.jpg"/>',
						padding: 50,
                        handler: function() {
                            gameRemoteHandler('right')
                        }
					})
				]
			}),
			new Ext.Button({
				ui: 'round',
				text: 'Down',
				padding: 50,
                handler: function() {
                    gameRemoteHandler('down')
                }
			}),
			{html: '', padding: 10}, /* just a little spacer */
			new Ext.List({
				itemTpl: '{name}',
				store: store,
				disableSelection: true
			})
		];
		
		var gameScreen = [
			new Ext.Panel({
				items: gameControls,
				layout: 'vbox'
			})
		];
    	
    	
		var splash = [
			new Ext.form.FormPanel({
				items: [
					{html: 'Welcome to Tron - Ready to Ride?' },
					new Ext.form.Text({
						id: 'gamename',
						label: 'Name'
					}),
					new Ext.Button({
						text: 'Join',
						handler: function(evt) {
							// go to the game screen							
							gameState.playerName = splash[0].getComponent('gamename').getValue();
							
							socket.connect();
							
							
							console.log('JOIN ' + gameState.playerName);
							
							// TODO: Plug in Nick's socket login stuff here:
							var loading = new Ext.LoadMask(
								Ext.getBody(),
								{msg: 'Preparing your lightcycle'}
							);
							//loading.show();
							Tron.app.setActiveItem(1);
						}
					})
				]
			})
		];
		

    	this.dockedItems = new Ext.Toolbar({
    		title: 'Tron Controller'
    	});
    	
        this.items = [splash, gameScreen];
        Tron.App.superclass.initComponent.call(this);
        
    },
});


