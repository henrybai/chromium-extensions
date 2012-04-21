// include config.js
// include dropzones.js

var DEBUG = false;

var DROPZONES_VERTICAL = 4;
var DROPZONES_HORIZONTAL = 5;

var DROPZONES_FADEIN_INTERVAL = 100;
var DROPZONES_FADEOUT_INTERVAL = 100;

function DROPZONE_WIDTH() { return Math.floor( ( window.innerWidth - ( DROPZONES_HORIZONTAL * 2 ) ) / DROPZONES_HORIZONTAL ); }
function DROPZONE_HEIGHT() { return Math.floor( ( window.innerHeight - ( DROPZONES_VERTICAL * 2 ) ) / DROPZONES_VERTICAL ); }

function DROPZONES_WIDTH_LEFTOVER() { return window.innerWidth - ( DROPZONE_WIDTH() *  DROPZONES_HORIZONTAL ) - ( DROPZONES_HORIZONTAL * 2 ); }
function DROPZONES_HEIGHT_LEFTOVER() { return window.innerHeight - ( DROPZONE_HEIGHT() *  DROPZONES_VERTICAL ) - ( DROPZONES_VERTICAL * 2 ); }

var DROPZONE_HEADER_HEIGHT = 26;
var DROPZONE_CONTENT_OPACITY = 0.4;
var DROPZONE_CONTENT_SELECTED_OPACITY = 0.9;
function DROPZONE_CONTENT_HEIGHT() { return DROPZONE_HEIGHT() - DROPZONE_HEADER_HEIGHT; }

// booleans for extension logic
var OPTIONS = false;
var DRAGGING = false;

var SEARCH_TEXT;
var DRAGSTART = { x: 0, y: 0 };
var DRAG_TOLERANCE = 50;
function DRAG_TOLERANCE_EXCEED( e )
{
	return ( Math.sqrt( square( e.clientX - DRAGSTART.x ) + square( e.clientY - DRAGSTART.y) ) > DRAG_TOLERANCE );
}

function square( val ) { return ( val * val ); }

function DRAG_PROCESS( e )
{
	if ( window.getSelection().toString() != "" )
	{
		return { search: window.getSelection().toString() };
	}
	else if ( e.srcElement.nodeName == "IMG" )
	{
		return { search: e.srcElement.src, link: e.srcElement.src };
	}
	else if ( e.srcElement.parentNode.nodeName == "A" )
	{
		return { search: e.srcElement.data, link: e.srcElement.parentNode.href };
	}
	//console.log( e.srcElement );
	//console.log( "window.getSelection().toString(): " + window.getSelection().toString() );
	//console.log( e.srcElement.parentNode );
}

var DROPZONES_DATA;

var client = new Client();
client.connect( "background" );
client.registerHandlers({
	"Settings.get": function( parameters ) {
		DROPZONES_DATA = parameters.data;
	},

	"Options": function() {
		if ( OPTIONS )
		{
			LOG( EXTENSION_NAME + " :: leaving options mode" );
			OPTIONS = false;
			DRAGGING = false;
			DropZones.remove();
		}
		else
		{
			LOG( EXTENSION_NAME + " :: entering options mode" );
			OPTIONS = true;
			DRAGGING = true;
			DropZones.create( DROPZONES_DATA );
			DropZones.show();
		}
	}
});

client.send( "Settings.get" );

$( document ).bind
({
	dragstart: function( e )
	{
		SEARCH_TEXT = DRAG_PROCESS( e );
		DRAGSTART = { x: e.clientX, y: e.clientY };
	},
	
	drag: function( e )
	{
		if ( !DRAGGING && DRAG_TOLERANCE_EXCEED( e ) )
		{
			DRAGGING = true;
			LOG( EXTENSION_NAME + " :: create dropzones" );
			DropZones.create( DROPZONES_DATA );
			LOG( EXTENSION_NAME + " :: show dropzones" );
			DropZones.show();
		}
	},

	dragend: function( e )
	{
		if( DRAGGING )
		{
			DRAGGING = false;
			DropZones.remove();
			LOG( EXTENSION_NAME + " :: hide dropzones" );
		}
	}

});

