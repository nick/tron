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
    
    	function gameRemoteHandler(evt) {
    		var direction = evt.text;
    		console.log('MOVE ' + direction);
		
    	}
    
		var gameControls = [
			new Ext.Button({
				ui: 'round',
				text: 'Up',
				padding: 50,
				handler: gameRemoteHandler
			}),
			new Ext.Container({
				layout: 'hbox',
				items: [
					new Ext.Button({
						ui: 'round',
						text: 'Left',
						padding: 50,
						handler: gameRemoteHandler
					}),
					{padding: 50},
					new Ext.Button({
						ui: 'round',
						text: 'Riht',
						//html: '<img src="http://www.psdgraphics.com/file/right-arrow-icon.jpg"/>',
						padding: 50,
						handler: gameRemoteHandler
					})
				]
			}),
			new Ext.Button({
				ui: 'round',
				text: 'Down',
				padding: 50,
				handler: gameRemoteHandler
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


