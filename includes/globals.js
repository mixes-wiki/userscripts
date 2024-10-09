/*
 * Global vars
 */
var d = $(document),
	url = $(location).attr('href'),
	apiUrlTools = 'https://www.mixes.wiki/tools/api/api.php',
	debugFilter = '[Mixes.wiki userscript]',
	TLbox = '<div class="Mixeswiki_WebTracklistsToCopy MixesDB_WebTracklistsToCopy" style="color:#f60; font-family:monospace,sans-serif; font-size:12px; margin-top:8px"></div><hr style="color:#ddd; margin-top:8px" /><p style="margin-top:8px; color:#f60; font-weight:bold">You still need to fix this in the <a href="https://www.mixes.wiki/tools/tracklist_editor/">Tracklist Editor</a></p>';


/*
 * Log functions
 */

// log
function log( text, debugFilter ) {
	console.log( debugFilter + ": " + text );
}

// logVar
function logVar( variable, string ) {
	if( string !== null ) {
		log( variable + ": " + string );
	} else {
		log( variable + " empty" );
	}
}

// logFunc
function logFunc( functionName ) {
	var seperator = "####################################";
	log( "\n"+ seperator +"\n# "+ functionName +"()\n"+ seperator );
}


/*
 * Usercript helpers
 */

// loadCSS
function loadCSS(u) {
	$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', u) );
}


/*
 * Create elements
 */

// create_input
function create_input( text, className ) {
	return '<input class="mixeswiki-element input '+ className +'" value="'+text+'" />';
}

// create_note
function create_note( text, className ) {
	return '<span class="mixeswiki-element note '+ className +'">'+text+'</span>';
}


/*
 * redirect on every url change event listener
 */
function redirectOnUrlChange() {
	// event listener
	var pushState = history.pushState;
	var replaceState = history.replaceState;
	history.pushState = function() {
		pushState.apply(history, arguments);
		window.dispatchEvent(new Event('pushstate'));
		window.dispatchEvent(new Event('locationchange'));
	};
	history.replaceState = function() {
		replaceState.apply(history, arguments);
		window.dispatchEvent(new Event('replacestate'));
		window.dispatchEvent(new Event('locationchange'));
	};
	window.addEventListener('popstate', function() {
		window.dispatchEvent(new Event('locationchange'))
	});
	
	// redirect
	window.addEventListener('locationchange', function(){
		var newUrl = location.href;
		log( 'onlocationchange event occurred > redirecting to ' + newUrl );
		window.location.replace( newUrl );
	});
}


/*
 * End
 */
loadCSS('https://raw.githubusercontent.com/Subfader/userscripts/refs/heads/main/includes/globals.css?v-1');

log( "globals.js loaded" );
