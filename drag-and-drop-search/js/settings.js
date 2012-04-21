function Settings() {

	var _data = null;

	this.reset = function() {
		Storage.set( "Settings", DEFAULT_SETTINGS );
	};
	
	this.save = function() {
		Storage.set( "Settings", _data );
	};
	
	this.get = function() {
		if ( _data == null )
		{
			_data = Storage.get( "Settings" );
			if ( _data == null )
			{
				_data = DEFAULT_SETTINGS;
				Storage.set( "Settings", _data );
			}
		}
		return _data;
	};
	
	this.setZone = function( index, name, url, favicon ) {
		if ( _data == null )
			this.get();
		
		if ( url )
			_data.zones[ index ].url = url;
		if ( name )
			_data.zones[ index ].name = name;
		if ( favicon )
			_data.zones[ index ].favicon = favicon;
			
		this.save();
	};
	
	this.removeZone = function( index ) {
		if ( _data == null )
			this.get();
		
		_data.zones[ index ].url = "";
		_data.zones[ index ].name = "";
		_data.zones[ index ].favicon = "";
		this.save();
	};
	
	this.newZone = function( name, url, favicon ) {
		if ( _data == null )
			this.get();
		
		for ( var i = 0; i < _data.zones.length; i++ )
		{
			if ( _data.zones[ i ][ "name" ] == "" && _data.zones[ i ][ "url" ] == "" && _data.zones[ i ][ "favicon" ] == "" )
			{
				this.setZone( i, name, url, favicon );
				break;
			}
		}
	};
	
	this.rearrangeZones = function( sequence ) {
		if ( _data == null )
			this.get();

		var temp = new Array;
		for ( var i = 0; i < _data.zones.length; i++ )
		{
			temp.push( _data.zones[ sequence[ i ] ] );
		}
		_data.zones = temp;
		this.save();		
	};
}