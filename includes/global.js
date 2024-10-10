/*
 * Global var definitions
 */
const d = $(document);
const url = $(location).attr('href');
const apiUrlTools = 'https://www.mixes.wiki/tools/api/api.php';
const debugFilter = '[Mixes.wiki userscript]';
const TLbox = '<div class="Mixeswiki_WebTracklistsToCopy MixesDB_WebTracklistsToCopy" style="color:#f60; font-family:monospace,sans-serif; font-size:12px; margin-top:8px"></div><hr style="color:#ddd; margin-top:8px" /><p style="margin-top:8px; color:#f60; font-weight:bold">You still need to fix this in the <a href="https://www.mixes.wiki/tools/tracklist_editor/">Tracklist Editor</a></p>';
const mdbLogoUrl64 = 'data:image/png;base64,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';

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

// loadCSS
function loadCSS(u) {
	$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', u) );
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
function create_input( text, className ) {
	return '<input class="mixeswiki-element input '+ className +'" value="'+text+'" />';
}

// create_note
function create_note( text, className ) {
	return '<span class="mixeswiki-element note '+ className +'">'+text+'</span>';
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
	loadCSS( '//www.mixes.wiki/tools/userscripts/tracklist_editor_copy.css' );
		
	tl.show().select().addClass("fixed");


	/* clipboard.js
	var clipboardButton = '<button class="clipboardButton floatL bold green" data-clipboard-target="#mixesdb-TLbox">Copy to clipboard</button>';
	tl.after( clipboardButton );

	var clipboard = new Clipboard('.clipboardButton');
	clipboard.on('success', function() {
	    $('.clipboardButton').removeClass('green').addClass('grey');
	});
	*/
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
