$( '.install-button :first-child' ).each( function()
{
	var button = $( this ).clone();
	var plugin_url = "https://addons.mozilla.org" + button.attr( 'href' );
	
	button.removeClass( 'concealed installer' );
	button.attr( 'href', "javascript:void(0);" );
	
	button.click( function( e )
	{
		e.preventDefault();	
		var client = new Client();
		client.connect( "background" );
		client.send( "Mozilla.script", { url: plugin_url } );
	});
		
	// this is a hack to remove the button's anonymous click handler
	$( this ).replaceWith( button );
});