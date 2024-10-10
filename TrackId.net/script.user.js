// ==UserScript==
// @name         TrackId.net (by Mixes.wiki)
// @author       User:Martin@Mixes.wiki (Subfader@GitHub)
// @version      2024.10.10.2
// @description  Change the look and behaviour of certain DJ culture related websites to help contributing to Mixes.wiki, e.g. add copy-paste ready tracklists in wiki syntax.
// @homepageURL  https://www.mixes.wiki/w/Help:Mixes.wiki_userscripts
// @supportURL   https://discord.com/channels/1258107262833262603/1261652394799005858
// @updateURL    https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/TrackId.net/script.user.js
// @downloadRL   https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/TrackId.net/script.user.js
// @require      https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/includes/jquery-3.7.1.min.js
// @require      https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/includes/waitForKeyElements.js
// @require      https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/includes/youtube_funcs.js
// @require      https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/includes/global.js?v-TrackId.net_15
// @resource     IMPORTED_CSS https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/includes/global.css?v-TrackId.net_12
// @include      http*trackid.net*
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @noframes
// @run-at       document-end
// ==/UserScript==

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Basics
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var timeoutDelay = 600;

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
 * Passing url pramater rquires the userscript "Mixes.wiki userscripts helper (by Mixes.wiki)"
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

    if( requestUrl !== "" ) {
        // add URL to input and try to submit
        waitForKeyElements( ".MuiGrid-grid-xs-12 .MuiFormControl-root input[type=text].MuiInputBase-input", submitrequest_input_wait);
        function submitrequest_input_wait(jNode) {
            log( "submitrequest_input_wait()" );

            // Submit notice cos we cannot just trigger a click on the the "VALIDATE" button
            // For YouTube URLs it doesn't allow a blank after the URL...
            var note_standard = create_note( "Press the SPACEBAR and ENTER to validate" ),
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
