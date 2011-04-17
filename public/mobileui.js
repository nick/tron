var randomPlayerID = 'p' + (Math.ceil(Math.random() * 10000000000) + 10000000000);
var socket = new io.Socket();

socket.on('connect', function(){ 
    // console.log('connected')
    socket.send('new player ' + randomPlayerID + ': ' + gameState.playerName);
});
socket.on('message', function(){ console.log('message') })
socket.on('disconnect', function(){ console.log('disconnect') })

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

function gameRemoteHandler(direction) {
	console.log('MOVE ' + direction);
	var str = 'player ' + randomPlayerID + ': ' + direction;
    // console.log(str);
    socket.send(str);
}

Tron.defaultAnim = Ext.is.Android ? false : 'slide';
Tron.App = Ext.extend(Ext.Panel, {
    cls: 'app',
    fullscreen: true,
    layout: 'card',
    activeItem: 0,
    
    initComponent: function() {
    
		var gameControls = [
			new Ext.Button({
				ui: 'round',
				html: '<img src="images/up-arrow-icon.png"/>',
				padding: 35,
				handler: function() {
                    gameRemoteHandler('up')
                }                
			}),
			new Ext.Container({
				layout: 'hbox',
				items: [
					new Ext.Button({
						ui: 'round',
						html: '<img src="images/left-arrow-icon.png"/>',
						padding: 35,
						handler: function() {
                            gameRemoteHandler('left')
                        }                
					}),
					{padding: 35},
					new Ext.Button({
						ui: 'round',
						html: '<img src="images/right-arrow-icon.png"/>',
						padding: 35,
						handler: function() {
                            gameRemoteHandler('right')
                        }                
					})
				]
			}),
			new Ext.Button({
				ui: 'round',
				html: '<img src="images/down-arrow-icon.png"/>',
				padding: 35,
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
                            // gyro.init();
                            // console.log('JOIN ' + gameState.playerName);
							
							var loading = new Ext.LoadMask(
								Ext.getBody(),
								{ msg: 'Preparing your lightcycle' }
							);
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


var gyro = {

  direction: 0,
  x0: 0,
  y0: 0,

  init: function () {
    if (window.DeviceMotionEvent!==undefined) {
      window.addEventListener('devicemotion', function (e) {
        var acc = e.accelerationIncludingGravity;
        gyro.update(acc.x, acc.y);
      }, false);
    } else {
      window.addEventListener('deviceorientation', function (e) {
        gyro.update(-e.beta/2, -e.gamma/2);
      }, false);
    }
  },

  update: function (x, y) {
    x = x - gyro.x0;
    y = y - gyro.y0;

    var direction;

    if (x>2) {
      direction = 0; //1;
    } else if (x<-2) {
      direction = 2; //3;
    } else if (y>2) {
      direction = 3; //0;
    } else if (y<-2) {
      direction = 1; //2;
    } else {
      direction = null;
    }

    if (window.orientation==-90) {
      direction = (direction + 1) % 4;
    } else if (window.orientation==180) {
      direction = (direction + 2) % 4;
    } else if (window.orientation==90) {
      direction = (direction +3) % 4;
    }

    if (gyro.direction != direction) {
      gyro.onDirectionChange(direction, gyro.direction);
    }
    gyro.direction = direction;

  },

  onDirectionChange: function (new_direction, old_direction) {
      
    if (new_direction==0) {
        gameRemoteHandler('up')
    } else if (new_direction==1) {
        gameRemoteHandler('right')
    } else if (new_direction==2) {
        gameRemoteHandler('down')
    } else if (new_direction==3) {
        gameRemoteHandler('left')
    } else {
      return;
    }
    
  console.log(new_direction);
  
  //   if (selected) {
  //     socket.send({move: {id: selected.id, x: selected.x + dx, y: selected.y + dy}});
  //   }
  // 
  }
  


}
