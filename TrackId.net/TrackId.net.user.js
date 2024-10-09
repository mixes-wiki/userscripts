// ==UserScript==
// @name         TrackId.net (by Mixes.wiki)
// @author       Mixes.wiki
// @version      2024.07.19.1
// @description  Make DJ Mix related wesbites better and make online tracklists parsable for the MixesDB Tracklist Editor
// @homepageURL  https://www.mixes.wiki/w/Help:Pimp_scripts
// @supportURL   https://www.mixes.wiki/w/MixesDB:Forum/Pimp_scripts
// @updateURL    https://www.mixes.wiki/tools/userscripts/TrackId.net.user.js
// @downloadRL   https://www.mixes.wiki/tools/userscripts/TrackId.net.user.js
// @include      http*trackid.net*
// @noframes
// @require      https://www.mixes.wiki/scripts/jquery/jquery-1.7.min.js
// @require      https://www.mixes.wiki/tools/userscripts/globals.js?trackidnet_2
// @require      https://www.mixes.wiki/tools/userscripts/youtube_funcs.js
// @require      https://www.mixes.wiki/scripts/waitForKeyElements/waitForKeyElements.js
// @run-at       document-end
// ==/UserScript==

/*
 * Move to gloabal.js
 */
// log functions
function log( text ) {
    console.log( debugFilter + ": " + text );
}
function logVar( variable, string ) {
    if( string !== null ) {
        log( variable + ": " + string );
    } else {
        log( variable + " empty" );
    }
}
function logFunc( functionName ) {
    var seperator = "####################################";
    log( "\n"+ seperator +"\n# "+ functionName +"()\n"+ seperator );
}

// create_input
function create_input( text, className ) {
    return '<input class="mixeswiki-element input '+ className +'" value="'+text+'" />';
}

// create_note
function create_note( text, className ) {
    return '<span class="mixeswiki-element note '+ className +'">'+text+'</span>';
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Basics
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var debugFilter = "[MW_TrackId.net]",
    timeoutDelay = 600;

// select elements
waitForKeyElements(".mixeswiki-element.select", mixeswikiElement_select);
function mixeswikiElement_select(jNode) {
    jNode.select().focus();
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Initialize feature functions per url path
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * Before anythings starts: Reload the page
 */
redirectOnUrlChange();

/*
 * grab url path and fire function
 */
$(document).ready(function(){
    var contentWrapper = $(".MuiGrid-grid-xs-12"),
        path1 = window.location.pathname.replace(/^\//, "");

    logVar( "path1", path1 );

    switch( path1 ) {
        case "submitrequest":
            on_submitrequest();
            break;
    }
});

/*
 * Submit request URLs
 * https://trackid.net/submitrequest
 * https://trackid.net/submitrequest?url=https://soundcloud.com/djrog/latin-vibes
 */
function on_submitrequest() {
    logFunc( "on_submitrequest" );

    // submitted URL, page preview pops up
    // if exists, take user directly there without confirmation
    // Test URL page exists: https://soundcloud.com/resident-advisor/ra944-tsvi
    // Test URL page does not exist: https://soundcloud.com/djrog/latin-vibes
    // buggy if this part comes after the requestUrl part
    waitForKeyElements( ".audio-stream-box", submitrequest_pagePreview_wait);
    function submitrequest_pagePreview_wait(jNode) {
        log( "submitrequest_pagePreview_wait()" );
        // if page exists or not: Does the next element contains the "VIEW TRACKLIST" button?
        var firstButton = jNode.next(".MuiGrid-container").find("button:first"),
            firstButton_text = firstButton.text().toLowerCase(); // "view tracklist"
        logVar( "firstButton text", firstButton_text )

        if( firstButton_text == "view tracklist" ) {
            // page exists, send user directly there
            // existing page might still be processing!
            firstButton.trigger("click"); // We cannot catch that URL
        } else {
            // page does not exist
            // stay cos user might want to use the option "Notify me when ready"
        }
    }

    // if url was passed as parameter
    var requestUrl = getURLParameter( "requestUrl" ),
        requestUrl_domain = new URL( requestUrl ).hostname.replace("www.","");
    logVar( "requestUrl", requestUrl );
    logVar( "requestUrl_domain", requestUrl_domain );

    if( requestUrl ) {
        // add URL to input and try to submit
        waitForKeyElements( ".MuiGrid-grid-xs-12 .MuiFormControl-root input[type=text].MuiInputBase-input", submitrequest_input_wait);
        function submitrequest_input_wait(jNode) {
            log( "submitrequest_input_wait()" );

            // Submit notice cos we cannot just trigger a click on the the "VALIDATE" button
            // For YouTube URLs it doesn't allow a blank after the URL...
            var note_standard = create_note( "Press the SPACEBAR and ENTER" ),
                note_YouTube  = create_note( "Press the SPACEBAR, BACKSPACE and ENTER" );

            switch( requestUrl_domain ) {
                case "youtube.com":
                    var submitNote = note_YouTube;
                    break;
                case "youtu.be":
                    var submitNote = note_YouTube;
                    break;
                default:
                    var submitNote = note_standard;
            }

            var input = create_input( requestUrl );
            jNode.closest(".MuiGrid-container").before( input );
            //var e = jQuery.Event( "keydown", { keyCode: 32 } );

            jNode.select();
            setTimeout(function () {
                jNode.val( requestUrl );
                //jNode.trigger( e );
                jNode.closest(".MuiGrid-container").after( submitNote );
            }, timeoutDelay);
        }
    }
}