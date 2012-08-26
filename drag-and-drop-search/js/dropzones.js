var DROPZONES_VERTICAL = 4;
var DROPZONES_HORIZONTAL = 5;

var DROPZONES_FADEIN_INTERVAL = 200;
var DROPZONES_FADEOUT_INTERVAL = 200;

function DROPZONE_WIDTH() { return Math.floor( ( window.innerWidth- ( DROPZONES_HORIZONTAL * 2 ) ) / DROPZONES_HORIZONTAL ); }
function DROPZONE_HEIGHT() { return Math.floor( ( window.innerHeight - ( DROPZONES_VERTICAL * 2 ) ) / DROPZONES_VERTICAL ); }

function DROPZONES_WIDTH_LEFTOVER() { return window.innerWidth - ( DROPZONE_WIDTH() *  DROPZONES_HORIZONTAL ) - ( DROPZONES_HORIZONTAL * 2 ); }
function DROPZONES_HEIGHT_LEFTOVER() { return window.innerHeight - ( DROPZONE_HEIGHT() *  DROPZONES_VERTICAL ) - ( DROPZONES_VERTICAL * 2 ); }

var DROPZONE_HEADER_HEIGHT = 26;
var DROPZONE_CONTENT_OPACITY = 0.4;
var DROPZONE_CONTENT_SELECTED_OPACITY = 0.9;
function DROPZONE_CONTENT_HEIGHT() { return DROPZONE_HEIGHT() - DROPZONE_HEADER_HEIGHT; }



var DROPZONE_HEADER = function( name, favicon )
{
	return $( '<div></div>' ).addClass( "dropzone_header" )
							 .height( DROPZONE_HEADER_HEIGHT )
							 .append( '<img src="' + favicon + '" /><span>' + name + '</span>' );
}

var DROPZONE_CONTENT = function( height )
{
	return $( '<div></div>' ).addClass( "dropzone_content" )
							 .height( height );
}

var DROPZONE_ZONE = function()
{
	return $( '<li></li>' ).addClass( "ui-state-default" )
						   .bind({
						   		dragenter : function ( e ) {
						   			e.preventDefault();
						   			$( this ).children( ".dropzone_content" ).css( "opacity", DROPZONE_CONTENT_SELECTED_OPACITY );
						   		},
								dragover: function( e )
								{	
								    e.preventDefault(); // Necessary. Allows us to drop.
								//	e.originalEvent.dataTransfer.dropEffect = "link";  //set drop image
								},
								dragleave: function( e )
								{
									$( this ).children( ".dropzone_content" ).css( "opacity", DROPZONE_CONTENT_OPACITY );
								},

								drop: function( e )
								{
									e.preventDefault();
								    e.stopPropagation(); // stops the browser from redirecting.
							
									var url = DROPZONES_DATA.zones[ $( this ).attr( "dd_zone_id" ) ][ "url" ];
									var data = unescape( url.match( SEARCH_PATTERN )[0] );

									if ( data == "{{search}}" )
									{
										data = SEARCH_OBJ.search;
									}
									else if ( data == "{{link}}" )
									{
										data = SEARCH_OBJ.link;
									}
									client.send( "Tabs.create", { url: url.replace( SEARCH_PATTERN, data ) } );
									$( this ).children( ".dropzone_content" ).css( "opacity", DROPZONE_CONTENT_SELECTED_OPACITY );
									
									return false;
								}
						   });
}

var DROPZONE_EMPTY_ZONE = function()
{
	return $( '<li></li>' ).addClass( "ui-state-disabled" )
						   .css( "visibility", "hidden" );
}

var DROPZONE_OPTIONS_ZONE = function()
{
	return $( '<li></li>' ).addClass( "ui-state-default" );
}

var DROPZONE_OPTIONS_HEADER = function( name, favicon )
{
	return $( '<div></div>' ).addClass( "dropzone_header" )
							 .height( DROPZONE_HEADER_HEIGHT )
							 .append( '<img src="' + favicon + '" />' )
							 .append( '<span>' + name + '</span>' )
							 .append( '<ul></ul>' )
							 .find( "ul" )
								 .append( '<li><img title="edit" class="dropzone_header_edit" src="' + EXTENSION_URL + 'images/edit.png" /></li>' )
								 .find( ".dropzone_header_edit" )
									 .click( function( e )
									 {
										 var dropzone = $( this ).closest( ".ui-state-default" );
										 var dropzone_header = $( this ).closest( ".dropzone_header" );
										 var dropzone_content = dropzone_header.next();
										 var save_edit_button = $( this );
										 
										 if ( $( this ).attr( "src" ) == EXTENSION_URL + "images/edit.png" )
										 {
											 $( this ).attr( "title", "save" )
													  .attr( "src", EXTENSION_URL + "images/save.png" );
										 
											// edit name of zone
											 dropzone_header.children( "span" )
															.replaceWith( '<input type="text" name="id" value="' + DROPZONES_DATA.zones[ dropzone.attr( "dd_zone_id" ) ][ "name" ] + '"/>' );
															
											 dropzone_header.find( "input[name='id']" )
																.keypress( function( e )
																{
																	if (event.keyCode == KEY.ENTER)
																	{
																		// click the save button
																		save_edit_button.trigger( 'click' );
																		return false;
																	}																		
																});
															//.end();
											 
											 dropzone_content.children( "div" )
															 .css( "visibility", "visible" )
															 .find( "input[name='favicon']" )
																.attr( "value", DROPZONES_DATA.zones[ dropzone.attr( "dd_zone_id" ) ][ "favicon" ] )
															 .end()
															 .find( "input[name='url']" )
																.attr( "value", DROPZONES_DATA.zones[ dropzone.attr( "dd_zone_id" ) ][ "url" ] )
															 .end();
											 
											 
											 dropzone_header.children( "input" ).focus();
										 }
										 else
										 {
											 $( this ).attr( "title", "edit" )
													  .attr( "src", EXTENSION_URL + "images/edit.png" );
											 var name = dropzone_header.children( "input[name='id']" ).attr( "value" );
											 var url = dropzone_content.find( "input[name='url']" ).attr( "value" );
											 var favicon = dropzone_content.find( "input[name='favicon']" ).attr( "value" );
											 
											 dropzone_header.children( "img" ).attr( "src", favicon );
											 dropzone_header.children( "input" ).replaceWith( '<span>' + name + '</span>' );
											 dropzone_content.children( "div" ).css( "visibility", "hidden" );
											 client.send( "Zones.set", { index: dropzone.attr( "dd_zone_id" ), name: name, url: url, favicon: favicon } );
										 }
									 })
								 .end()
								 .append( '<li><img title="close" class="dropzone_header_close" src="' + EXTENSION_URL + 'images/close.png" /></li>' )
								 .find( ".dropzone_header_close" )
									 .click( function( e )
									 {
										 var dropzone = $( this ).closest( ".ui-state-default" );
										 client.send( "Zones.remove", { index: dropzone.attr( "dd_zone_id" ) } );
										 
										 var _zone = ( new DROPZONE_OPTIONS_EMPTY_ZONE( dropzone.attr( "dd_zone_id" ) ) ).width( DROPZONE_WIDTH() )
																												 .height( DROPZONE_HEIGHT() );
										 dropzone.replaceWith( _zone );
									 })
								 .end()
							 .end();
}

var DROPZONE_OPTIONS_CONTENT = function( height )
{
	return $( '<div></div>' ).addClass( "dropzone_content" )
							 .height( height )
							 .append( '<div style="visibility: hidden;"></div>' )
							 .find( "div" )
								.append( '<label>Icon:</label><br /><input type="text" name="favicon" /><br />' )
								.append( '<label>URL:</label><br /><input type="text" name="url" />' )
							 .end();
}

var DROPZONE_OPTIONS_EMPTY_ZONE = function( id )
{
	return $( '<li></li>' ).attr( "class" , "ui-state-disabled" )
						   .attr( "dd_zone_id", id )
						   .append( '<img title="add" style="float: right; padding: 5px;" src="' + EXTENSION_URL + 'images/add.png" />' )
						   .bind({
								dragstart: function( e )
								{
									return false;
								}
						   })
						   .find( "img" )
								.click( function( e )
								{
									$( this ).parent().attr( "class", "ui-state-default" )
											 .append( new DROPZONE_OPTIONS_HEADER( "", "" ) )
													  .append( new DROPZONE_OPTIONS_CONTENT( DROPZONE_CONTENT_HEIGHT() ) );
										
									// click the edit button
									$( this ).parent().find( "img[class='dropzone_header_edit']" ).trigger( 'click' );			  
									// delete add button
									$( this ).remove();
									return false;
								})
						   .end();
}

var DropZone = function( id, name, url, favicon )
{
	if ( name != "" || url != "" || favicon != "" )
	{
		if ( OPTIONS )
		{
			return ( new DROPZONE_OPTIONS_ZONE ).attr( "dd_zone_id", id )
												.width( DROPZONE_WIDTH() )
												.height( DROPZONE_HEIGHT() )
												.append( new DROPZONE_OPTIONS_HEADER( name, favicon ) )
												.append( new DROPZONE_OPTIONS_CONTENT( DROPZONE_CONTENT_HEIGHT() ) );
		}
		else
		{
			// add leftover space to first row and column to hide whitespace - can't do this in options mode because of dragging
			return ( new DROPZONE_ZONE ).attr( "dd_zone_id", id )
										.width( DROPZONE_WIDTH() + ( ( id % DROPZONES_HORIZONTAL == 0 ) ? DROPZONES_WIDTH_LEFTOVER() : 0 ) )
										.height( DROPZONE_HEIGHT() + ( ( id < DROPZONES_HORIZONTAL ) ? DROPZONES_HEIGHT_LEFTOVER() : 0 ) )
										.append( new DROPZONE_HEADER( name, favicon ) )
										.append( new DROPZONE_CONTENT( DROPZONE_CONTENT_HEIGHT() + ( ( id < DROPZONES_HORIZONTAL ) ? DROPZONES_HEIGHT_LEFTOVER() : 0 ) ) );
		}
	}
	else
	{
		if ( OPTIONS )
		{
			return ( new DROPZONE_OPTIONS_EMPTY_ZONE( id ) ).width( DROPZONE_WIDTH() )
															.height( DROPZONE_HEIGHT() );
		}
		else
		{
			// add leftover space to first row and column to hide whitespace - can't do this in options mode because of dragging
			return ( new DROPZONE_EMPTY_ZONE ).attr( "dd_zone_id", id )
											  .width( DROPZONE_WIDTH() + ( ( id % DROPZONES_HORIZONTAL == 0 ) ? DROPZONES_WIDTH_LEFTOVER() : 0 ) )
											  .height( DROPZONE_HEIGHT() + ( ( id < DROPZONES_HORIZONTAL ) ? DROPZONES_HEIGHT_LEFTOVER() : 0 ) );
		}
	}
}

var DropZones = new function()
{

	this.create = function( data )
	{
		if (data) {
			var dropZoneHolder = $( '<ul id="dropzones"' + 
				( ( OPTIONS ) ? ' style="background-color: white; height: 100%;"'  :  "" ) + '></ul>' );
			
			$.each( DROPZONES_DATA.zones, function( index, zone )
			{
				var _dropzone = new DropZone( index, zone[ "name" ], zone[ "url" ], zone[ "favicon" ] );
				_dropzone.appendTo( dropZoneHolder );
			});

			$( document.body ).prepend(dropZoneHolder);
			
			$( function() {
				$("#dropzones").sortable({
					cancel: '.ui-state-disabled',
					containment: 'parent',
					tolerance: 'pointer',
					items: '.ui-state-default',
					update: function( event, ui )
					{
						// new sequence of ids
						var seq = new Array();
						$( "#dropzones > li" ).each( function( index )
						{
							seq.push( $( this ).attr( "dd_zone_id" ) );
							$( this ).attr( "dd_zone_id", index );
						});
						client.send( "Zones.rearrange", { sequence: seq } );
					}
				});
				$("#dropzones").disableSelection();
			});
		} else {
			LOG("ERROR! Empty Zone Data!");
		}
	};
	
	this.show = function()
	{
		ScrollBar.hide();
		$( "#dropzones" ).fadeIn( DROPZONES_FADEIN_INTERVAL );
	};
	
	this.remove = function()
	{
		$( "#dropzones" ).fadeOut( DROPZONES_FADEIN_INTERVAL, function()
		{
			$( this ).remove();
			ScrollBar.restore();
		});		
	};
};

var ScrollBar = new function()
{
	var _overflowBody = "";
	var _overflowHTML = "";

	this.hide = function()
	{
		if ( _overflowBody == "" && _overflowHTML == "")
		{
			_overflowBody = $( document.body ).css( "overflow" );
			_overflowHTML = $(  "html" ).css( "overflow" );
			$( document.body ).css( "overflow", "hidden" );
			$( "html" ).css( "overflow", "hidden" );
		}
	};
	
	this.restore = function()
	{
		if ( _overflowBody != "" || _overflowHTML != "")
		{
			$( document.body ).css( "overflow", _overflowBody );
			$(  "html" ).css( "overflow", _overflowHTML );
			_overflowBody = "";
			_overflowHTML = "";
		}
	};
};