// ==UserScript==
// @name         Mixes.wiki Userscripts Helper (by Mixes.wiki)
// @author       User:Martin@Mixes.wiki (Subfader@GitHub)
// @version      2024.10.10.4
// @description  Change the look and behaviour of the mixes.wiki website to enable feature usable by other Mixes.wiki userscripts.
// @homepageURL  https://www.mixes.wiki/w/Help:Mixes.wiki_userscripts
// @supportURL
// @updateURL    https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/Mixes.wiki_userscripts_helper/script.user.js
// @downloadRL   https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/Mixes.wiki_userscripts_helper/script.user.js
// @require      https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/includes/jquery-3.7.1.min.js
// @require      https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/includes/waitForKeyElements.js
// @require      https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/includes/global.js?v-Mixes.wiki_1
// @match        https://www.mixes.wiki/*
// @noframes
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==


/* ToDos
 * Add @supportURL to discord channel "Mixes.wiki userscripts"
 */


/*
 * TrackId.net support
 */

/*
 * On mix pages, make the page icon for TrackId.net open 2 tabs:
 * 1st tab: Search the mix page title (as by default)
 * 2nd tab: If the mix page contains a player: Open the "Submit Request" page on TackId.net and insert the URL of the first player.
 * Inserting the player URL in the form requires the userscript "TrackId.net (by Mixes.wiki)".
 */

// Prepare variables to check if we're on a mix page
var actionView =  $("body").hasClass("action-view") ? true : false,
    isNs0 = $("body").hasClass("ns-0") ? true : false,
    isMainPage = $("body").hasClass("rootpage-Main_Page") ? true : false;

log( "actionView: " + actionView );
log( "isNs0: " + isNs0 );
log( "isMainPage: " + isMainPage );


// Check if we're on a mix page
if( actionView && isNs0 && !isMainPage ) {
    log( "Criteria for mix page matched." );

    // on click add request page url for the first visible player
    $("#pageIconPlayers.trackIdNet").click(function(){
        var linkIcon = $("#pageIcons a.trackIdNet"),
            urlSearch = linkIcon.attr("href").replace(/ /,"%20"),
            requestPlayerUrl = $(".playerWrapper:visible[data-playerurl]").first().attr("data-playerurl"); // first visible player
        log( "urlSearch (before): " + urlSearch );

        if( requestPlayerUrl ) {
            log( "requestPlayerUrl: " + requestPlayerUrl );
            var urlRequest = "https://trackid.net/submitrequest?requestUrl="+requestPlayerUrl,
                multiUrl = "https://www.mixes.wiki/tools/open/?urls="+encodeURIComponent(urlSearch)+","+encodeURIComponent( urlRequest );

            linkIcon.attr("href", multiUrl);

            log( "URL changed to: " + multiUrl );
        } else {
            log( "No first player URL found" );
        }
    });
} else {
    log( "Criteria for mix page not matched." );
}
