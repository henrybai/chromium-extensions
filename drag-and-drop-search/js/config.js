var DEBUG = false;

var EXTENSION_URL = chrome.extension.getURL( "" );
var EXTENSION_ID = chrome.i18n.getMessage( "@@extension_id" );
var EXTENSION_NAME = chrome.i18n.getMessage( "@@extension_name" );
var EXTENSION_DESCRIPTION = chrome.i18n.getMessage( "@@extension_description" );

var SEARCH_PATTERN = /({|%7B){2}(search|link)(%7D|}){2}/gi;

var KEY = {
	SHIFT: 16, CTRL: 17, ALT: 18
};

var DEFAULT_SETTINGS = {
	settings:
	{
		"rows": 5,
		"columns": 4
		//index: 'true',
		//ground: 'true',
	},
	
	zones:
	[
		{ "name": "google",		"favicon": "http://www.google.com.sg/favicon.ico",	"url": "http://www.google.com.sg/search?&q={{search}}" },
		{ "name": "youtube",	"favicon": "http://www.youtube.com/favicon.ico",	"url": "http://www.youtube.com/results?search_query={{search}}" },
		{ "name": "wikipedia",	"favicon": "http://en.wikipedia.org/favicon.ico",	"url": "http://en.wikipedia.org/wiki/Special:Search?search={{search}}" },
		{ "name": "flickr", 	"favicon": "http://www.flickr.com/favicon.ico",		"url": "http://www.flickr.com/search/?q={{search}}"	},
		{ "name": "bit.ly",		"favicon": "http://bit.ly/favicon.ico",				"url": "http://bit.ly/?u={{link}}&searchButton=Shorten" },
		
		{ "name": "facebook",	"favicon": "http://www.facebook.com/favicon.ico",	"url": "http://www.facebook.com/search/?q={{search}}" },
		{ "name": "",			"favicon": "",										"url": "" },
		{ "name": "",			"favicon": "",										"url": "" },
		{ "name": "",			"favicon": "",										"url": "" },
		{ "name": "gamespot",	"favicon": "http://www.gamespot.com/favicon.ico",	"url": "http://www.gamespot.com/search.html?qs={{search}}" },
		
		{ "name": "delicious",	"favicon": "http://delicious.com/favicon.ico",		"url": "http://delicious.com/search?p={{search}}" },
		{ "name": "",			"favicon": "",										"url": "" },
		{ "name": "",			"favicon": "",										"url": "" },
		{ "name": "",			"favicon": "",										"url": "" },
		{ "name": "keepvid",	"favicon": "http://keepvid.com/favicon.ico",		"url": "http://keepvid.com/?url={{link}}" },	
		{ "name": "translate",	"favicon": "http://translate.google.com/favicon.ico","url": "http://translate.google.com/#auto|en|{{search}}" },
		{ "name": "twitter",	"favicon": "http://www.twitter.com/favicon.ico",	"url": "http://search.twitter.com/search?q={{search}}"	},
		{ "name": "baidu",		"favicon": "http://www.baidu.com/favicon.ico",		"url": "http://www.baidu.com/s?wd={{search}}" },
		{ "name": "bing",		"favicon": "http://www.bing.com/favicon.ico",		"url": "http://www.bing.com/search?q={{search}}" },
		{ "name": "yahoo",		"favicon": "http://www.yahoo.com/favicon.ico",		"url": "http://search.yahoo.com/search?p={{search}}" }
	]
};

function LOG( message ) {
	if ( DEBUG ) {
		console.log ( message );
	}
}