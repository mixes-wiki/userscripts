/*
 * Global var definitions
 */
const d = $(document);
const url = $(location).attr('href');
const apiUrlTools = 'https://www.mixes.wiki/tools/api/api.php';
const debugFilter = '[Mixes.wiki userscript]';
const TLbox = '<div class="Mixeswiki_WebTracklistsToCopy MixesDB_WebTracklistsToCopy" style="color:#f60; font-family:monospace,sans-serif; font-size:12px; margin-top:8px"></div><hr style="color:#ddd; margin-top:8px" /><p style="margin-top:8px; color:#f60; font-weight:bold">You still need to fix this in the <a href="https://www.mixes.wiki/tools/tracklist_editor/">Tracklist Editor</a></p>';
const mwLogoUrl = 'https://www.mixes.wiki/w/resources/assets/mixes.wiki.png';

/*
 * Log functions
 */

// log
function log( text ) {
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
 * URL funcs
 */

// urlPath
function urlPath(n) {
	return url.split('/')[n+2];
}
var domain = urlPath(0).replace(/.+\.(.+\.[a-z0-9]+)/gi, '$1'),
	subdomain = urlPath(0);

// getURLParameter
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]'+name+'=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}


/*
 * Userscript helpers
 */

/* 
 * loadRawCss
 * GitHub delivers either the wrong MIME type for CSS fiels, so they can't be parsed in strict_mode
 * or deliveres outdated caches files:
 * https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/TrackId.net/script.css   < Up to date, but Wrong MIME type. Wonn't be parsed in strict_mode
 * https://cdn.rawgit.com/mixes-wiki/userscripts/refs/heads/main/TrackId.net/script.css              < Redirects to:
 * https://cdn.jsdelivr.net/gh/mixes-wiki/userscripts@refs/heads/main/TrackId.net/script.css         < Outdated for 2 hours
 * https://cdn.jsdelivr.net/gh/mixes-wiki/userscripts@latest/TrackId.net/script.css                  < same
 * https://cdn.jsdelivr.net/gh/mixes-wiki/userscripts/TrackId.net/script.css                         < same
 * 
 * Hence the only way to receive the latest commited version and have it parsed
 * is by loading the content of the raw.githubusercontent.com CSS file
 * and embed the CSS text in a scripttag
 */
function loadRawCss( urlVar ) {
    $.ajax({
        url: urlVar,
        dataType: "text",
        success: function(cssText) {
            // cssText will be a string containing the text of the file
            $('head').append( '<style>'+cssText+'</style>' );
        }
    });
}

// durToSec
function durToSec( dur ) {
    var hms = dur.trim();   // your input string
    var a = hms.split(':'); // split it at the colons

    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

    return seconds;
}


/*
 * Create elements
 */

// create_input
function create_input( text, className, id ) {
	return '<input class="mixeswiki-element input '+ className +'" id="'+id+'" name="'+id+'" value="'+text+'" />';
}

// create_note
function create_note( text, className ) {
	return '<span class="mixeswiki-element note '+ className +'">'+text+'</span>';
}

// create_button
function create_button( text, className, type ) {
	return '<button type="'+type+'" class="mixeswiki-element button '+ className +'">'+text+'</button>';
}


/*
 * Tracklist funcs
 */

// Autosize 3.0.15
// http://www.jacklmoore.com/autosize
!function(e,t){if("function"==typeof define&&define.amd)define(["exports","module"],t);else if("undefined"!=typeof exports&&"undefined"!=typeof module)t(exports,module);else{var n={exports:{}};t(n.exports,n),e.autosize=n.exports}}(this,function(e,t){"use strict";function n(e){function t(){var t=window.getComputedStyle(e,null);p=t.overflowY,"vertical"===t.resize?e.style.resize="none":"both"===t.resize&&(e.style.resize="horizontal"),c="content-box"===t.boxSizing?-(parseFloat(t.paddingTop)+parseFloat(t.paddingBottom)):parseFloat(t.borderTopWidth)+parseFloat(t.borderBottomWidth),isNaN(c)&&(c=0),i()}function n(t){var n=e.style.width;e.style.width="0px",e.offsetWidth,e.style.width=n,p=t,f&&(e.style.overflowY=t),o()}function o(){var t=window.pageYOffset,n=document.body.scrollTop,o=e.style.height;e.style.height="auto";var i=e.scrollHeight+c;return 0===e.scrollHeight?void(e.style.height=o):(e.style.height=i+"px",v=e.clientWidth,document.documentElement.scrollTop=t,void(document.body.scrollTop=n))}function i(){var t=e.style.height;o();var i=window.getComputedStyle(e,null);if(i.height!==e.style.height?"visible"!==p&&n("visible"):"hidden"!==p&&n("hidden"),t!==e.style.height){var r=d("autosize:resized");e.dispatchEvent(r)}}var s=void 0===arguments[1]?{}:arguments[1],a=s.setOverflowX,l=void 0===a?!0:a,u=s.setOverflowY,f=void 0===u?!0:u;if(e&&e.nodeName&&"TEXTAREA"===e.nodeName&&!r.has(e)){var c=null,p=null,v=e.clientWidth,h=function(){e.clientWidth!==v&&i()},y=function(t){window.removeEventListener("resize",h,!1),e.removeEventListener("input",i,!1),e.removeEventListener("keyup",i,!1),e.removeEventListener("autosize:destroy",y,!1),e.removeEventListener("autosize:update",i,!1),r["delete"](e),Object.keys(t).forEach(function(n){e.style[n]=t[n]})}.bind(e,{height:e.style.height,resize:e.style.resize,overflowY:e.style.overflowY,overflowX:e.style.overflowX,wordWrap:e.style.wordWrap});e.addEventListener("autosize:destroy",y,!1),"onpropertychange"in e&&"oninput"in e&&e.addEventListener("keyup",i,!1),window.addEventListener("resize",h,!1),e.addEventListener("input",i,!1),e.addEventListener("autosize:update",i,!1),r.add(e),l&&(e.style.overflowX="hidden",e.style.wordWrap="break-word"),t()}}function o(e){if(e&&e.nodeName&&"TEXTAREA"===e.nodeName){var t=d("autosize:destroy");e.dispatchEvent(t)}}function i(e){if(e&&e.nodeName&&"TEXTAREA"===e.nodeName){var t=d("autosize:update");e.dispatchEvent(t)}}var r="function"==typeof Set?new Set:function(){var e=[];return{has:function(t){return Boolean(e.indexOf(t)>-1)},add:function(t){e.push(t)},"delete":function(t){e.splice(e.indexOf(t),1)}}}(),d=function(e){return new Event(e)};try{new Event("test")}catch(s){d=function(e){var t=document.createEvent("Event");return t.initEvent(e,!0,!1),t}}var a=null;"undefined"==typeof window||"function"!=typeof window.getComputedStyle?(a=function(e){return e},a.destroy=function(e){return e},a.update=function(e){return e}):(a=function(e,t){return e&&Array.prototype.forEach.call(e.length?e:[e],function(e){return n(e,t)}),e},a.destroy=function(e){return e&&Array.prototype.forEach.call(e.length?e:[e],o),e},a.update=function(e){return e&&Array.prototype.forEach.call(e.length?e:[e],i),e}),t.exports=a});

// fixTLbox
function fixTLbox( feedback ) {
	var tl = $("#mixesdb-TLbox");
	tl.html( tl.html().replace(/&(nbsp|thinsp);/g, ' ') );
	var text = "TEMPBEGINNING" + tl.val(),
		textFix = text.replace(/TEMPBEGINNING(\n)?/g,"")
	                  .replace(/\n$/g,"")
					  .replace(/( )+/g, " ");
	tl.val(textFix);
	var text = tl.val(),
		lines = text.split("\n"),
		count = lines.length;
	tl.attr('rows', count);

	if( domain != "beatport.com" ) autosize(tl); // beatport.com buggy in FF

	if( feedback != null && feedback.text ) {
		var tle = $("#tlEditor");
		tle.addClass("bot10");
		tl.attr( "id", "mixesdb-TLbox tlEditor-textarea" );

		if( feedback.warnings > 0 ) {
			tle.addClass( "tlEditor-feedback-warning" );
		} else {
			if( feedback.hints > 0 ) {
				tle.addClass( "tlEditor-feedback-hint" );
			} else {
				if( feedback.status == "incomplete" ) {
					tle.addClass( "tlEditor-feedback-hint" );
				} else {
					tle.addClass( "tlEditor-feedback-complete" );
				}
			}
		}
		tl.after( feedback.text );
	}
	loadRawCss( "https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/includes/Tracklist_Editor_copy.css" );
		
	tl.show().select().addClass("fixed");
}

// apiTracklist
// allow site domain in Apache
// allow mixesdb scxripts on site
function apiTracklist( tl, type, genType ) {
	var data = { query: "tracklistEditor",
				 type: type,
				 genType: genType,
				 // Mixcloud bug when unicode_repl.js is included
				 //text: replaceUnicode( tl )
				 text: tl
			   };

	var jqXHR = $.ajax({
		type: "POST",
		url: apiUrlTools,
		data: data,
		async: false
	});

	var res = JSON.parse(jqXHR.responseText);

	return res;
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
log( "globals.js loaded" );
