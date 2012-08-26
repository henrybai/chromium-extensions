var settings = new Settings();
settings.reset();

var server = new Server( "background" );
server.registerHandlers({

	"Settings.get": function( port, parameters ) {
		server.send( port, "Settings.get", { data: settings.get() } );
	},
	
	"Tabs.create": function( port, parameters ) {
		chrome.tabs.create({
			"url": parameters.url,
			"selected": false
		});
	},
	
	"Zones.set": function( port, parameters ) {
		settings.setZone( parameters.index, parameters.name, parameters.url, parameters.favicon );
		server.send( port, "Settings.get", { data: settings.get() } );
	},
	
	"Zones.remove": function( port, parameters ) {
		settings.removeZone( parameters.index );
		server.send( port, "Settings.get", { data: settings.get() } );
	},
	
	"Zones.rearrange": function( port, parameters ) {
		settings.rearrangeZones( parameters.sequence );
		server.send( port, "Settings.get", { data: settings.get() } );
	},
});

chrome.browserAction.onClicked.addListener( function( tab )
{
	server.send( tab, "Options" );
});

chrome.tabs.onUpdated.addListener( function( tabId, changeInfo, tab )
{
	if ( changeInfo.status == "complete" )
	{
		// user attempts to add new dropzone via typing {{search}} or {{link}} into a GET form
		if ( tab.url.match( SEARCH_PATTERN ) ) {
			var name = tab.url.match( /[^(ht|f)tp(s?):\/\/]([^\/]+)/i );
			var favicon = tab.favIconUrl;
			if ( favicon == null )
			{
				favicon = tab.url.match( /^(?:f|ht)tp(?:s)?\:\/\/([^\/]+)/i )[ 0 ] + "/favicon.ico";
			}
			settings.newZone( name[0], tab.url, favicon );
			server.send( tabId, "Settings.get", { data: settings.get() } );
		}
		
	}
});
