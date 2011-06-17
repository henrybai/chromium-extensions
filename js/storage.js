var Storage = function() {

	return {
	
		clear: function() {
			window.localStorage.clear();
		},
		
		remove: function( key ) {
			window.localStorage.removeItem( key );
		},
		
		length: function() {
			return window.localStorage.length;
		},
		
		get: function( key ) {
			var value = window.localStorage.getItem( key );
			return ( value == null ) ? value : JSON.parse( value );
		},
		
		set: function( key, value ) {
			window.localStorage.setItem( key, JSON.stringify( value ) );
		}
		
	};
	
}();