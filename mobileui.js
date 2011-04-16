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

Tron.defaultAnim = Ext.is.Android ? false : 'slide';
Tron.App = Ext.extend(Ext.Panel, {
    cls: 'app',
    fullscreen: true,
    layout: 'card',
    activeItem: 0,
    
    initComponent: function() {
    
    	function gameRemoteHandler(evt) {
    		var direction = evt.text;
    		console.log('MOVE ' + direction);
    	
    	}
    
		var gameControls = [		
			new Ext.Button({
				ui: 'round',
				text: 'Up',
				handler: gameRemoteHandler
			}),
			new Ext.Container({
				layout: 'hbox',
				items: [
					new Ext.Button({
						ui: 'round',
						text: 'Left',
						handler: gameRemoteHandler
					}),
					new Ext.Button({
						ui: 'round',
						text: 'Right',
						handler: gameRemoteHandler
					}),
				]
			}),
			new Ext.Button({
				ui: 'round',
				text: 'Down',
				handler: gameRemoteHandler
			})
		];
		
		var splash = [
			new Ext.form.FormPanel({
				items: [
					{html: 'Welcome to Tron - Ready to Ride?' },
					{html: 'Name' },
					new Ext.form.Text({
						id: 'gamename'
					}),
					new Ext.Button({
						text: 'Join',
						handler: function(evt) {
							// go to the game screen							
							gameState.playerName = splash[0].getComponent('gamename').getValue();
							
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
		
		
		var gameScreen = [
			new Ext.Panel({
				items: gameControls,
				layout: 'vbox'
			})
		];
    	
    	
        this.items = [splash, gameScreen];
        Tron.App.superclass.initComponent.call(this);
        
    },
});


