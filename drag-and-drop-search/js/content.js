// include config.js
// include dropzones.js


// booleans for extension logic
var OPTIONS = false;
var DRAGGING = false;

var SEARCH_OBJ;
var DRAGSTART = { x: 0, y: 0 };
var DRAG_TOLERANCE = 40;
function dragToleranceExceed( oldX, oldY, newX, newY, dragTolerance )
{
	return (Math.pow( newX - oldX, 2 ) + Math.pow( newY - oldY, 2) > Math.pow(dragTolerance, 2) );
}

function getDraggedObject( event )
{
	var draggedObj;
	LOG(event);
	
	if ( event.srcElement.nodeName == "A" )	{	
		draggedObj =  { search: event.srcElement.innerText, link: event.srcElement.href };
	} else if ( window.getSelection().toString() != "" ) {
		draggedObj =  { search: window.getSelection().toString() };
	}
	if (draggedObj) {
		draggedObj.search = draggedObj.search.replace(/(\r\n|\n|\r)/gm," ").replace(/^\s+|\s+$/g,"");
		if (getLink(draggedObj.search)) { draggedObj.link = getLink(draggedObj.search); }

		LOG("dragged Object - " + JSON.stringify(draggedObj));
	}
	return draggedObj;
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
			LOG( "leaving options mode" );
			OPTIONS = false;
			DRAGGING = false;
			DropZones.remove();
		}
		else
		{
			LOG( "entering options mode" );
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
	dragstart: function( event )
	{
		SEARCH_OBJ = getDraggedObject( event );
		DRAGSTART = { x: event.originalEvent.clientX , y: event.originalEvent.clientY };
	},
	
	drag: function( event )
	{
		if (SEARCH_OBJ && !DRAGGING && dragToleranceExceed( DRAGSTART.x, DRAGSTART.y, event.originalEvent.clientX, event.originalEvent.clientY, DRAG_TOLERANCE ))
		{
			DRAGGING = true;
			LOG( "create dropzones" );
			DropZones.create( DROPZONES_DATA );
			LOG( "show dropzones" );
			DropZones.show();
		}
	},

	dragend: function( event )
	{
		if( DRAGGING )
		{
			DRAGGING = false;
			DropZones.remove();
			LOG( "remove dropzones" );
		}
	}

});


// Extract the link from the given text if any.
// Otherwise return empty string.
function getLink(text){
	var re = /https?:\/\/([-\w\.]+)+(:\d+)?(\/([-\w\/_~\.,#%=\*:]*(\?\S+)?)?)?/;
    var re2 = /\.[-\w\.]+(\/[\S]*)*/;
	var link = "";
	var matches = text.match(re);
	if (matches) {
		link = matches[0];
	} else {
		matches = text.match(re2);
		if (matches) {
			link = "http://" + matches[0];
		}
	}
	return link;
}

