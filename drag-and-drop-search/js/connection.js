//include config.js


var Client = function() {
	var _port;
	var _server_name;
	var _messageHandlers = new Array();	
	
	var _messageCentre = function( message )
	{
		var command = message.command;
		var parameters = message;
		
		if ( _messageHandlers[ command ] )
		{
			_messageHandlers[ command ]( parameters );
		}
		else
		{
			LOG( "UNKNOWN COMMAND: " + command );
		}
	}
	
	this.registerHandler = function( command, handler )
	{
		_messageHandlers[ command ] = handler;
	}
	
	this.registerHandlers = function( list )
	{
		$.each( list, function( command, handler )
		{
			_messageHandlers[ command ] = handler;
		});
	}
	
	this.connect = function( server_name )
	{
		if ( _server_name )
		{
			_port.disconnect();
		}
	
		_server_name = server_name;
		_port = chrome.extension.connect( { "name": server_name } );
		
		_port.onMessage.addListener( function( message )
		{
			_messageCentre( message );
		});
		
		_port.onDisconnect.addListener( function()
		{
			delete _port;
		});
	};
	
	this.send = function( command, parameters )
	{
		var message = ( parameters != null ) ? parameters : new Object();
		message[ "command" ] = command;
		
		if ( _port )
		{		
			_port.postMessage( message );
		}
	};
};

var Server = function( name ) {
	var _name = name;
	var _clients = new Array();
	var _messageHandlers = new Array();	
	
	var _messageCentre = function( port, message )
	{
		var command = message.command;
		var parameters = message;
		
		if ( _messageHandlers[ command ] )
		{
			_messageHandlers[ command ]( port, parameters );
		}
		else
		{
			LOG( "UNKNOWN COMMAND: " + command );
		}
	}
	
	this.registerHandler = function( command, handler )
	{
		_messageHandlers[ command ] = handler;
	}
	
	this.registerHandlers = function( list )
	{
		$.each( list, function( command, handler )
		{
			_messageHandlers[ command ] = handler;
		});
	}	
	
	// id refers to tab/port/tabId
	this.send = function( Id, command, parameters )
	{
		var message = ( parameters != null ) ? parameters : new Object();
		message[ "command" ] = command;
		if ( Id.postMessage )
		{
			Id.postMessage( message );
		}
		else if ( Id in _clients )
		{
			_clients[ Id ].postMessage( message );
		}
		else if ( Id.id in _clients )
		{
			_clients[ Id.id ].postMessage( message );
		}
	};
	
	chrome.extension.onConnect.addListener( function( port )
	{
		if ( port.name == _name )
		{
			_clients[ port.sender.tab.id ] = port;
			
			port.onMessage.addListener( function( message )
			{
				_messageCentre( port, message );
			});
			
			port.onDisconnect.addListener( function()
			{
				delete _clients[ port.sender.tab.id ];
			});
		}
	});
};