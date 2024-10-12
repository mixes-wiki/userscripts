// ==UserScript==
// @name         Mixes.wiki Userscripts Helper (by Mixes.wiki)
// @author       User:Martin@Mixes.wiki (Subfader@GitHub)
// @version      2024.10.12.1
// @description  Change the look and behaviour of the Mixes.wiki website to enable feature usable by other Mixes.wiki userscripts.
// @homepageURL  https://www.mixes.wiki/w/Help:Mixes.wiki_userscripts
// @supportURL   https://discord.com/channels/1258107262833262603/1293952534268084234
// @updateURL    https://cdn.rawgit.com/mixes-wiki/userscripts/refs/heads/main/Mixes.wiki_userscripts_helper/script.user.js
// @downloadRL   https://cdn.rawgit.com/mixes-wiki/userscripts/refs/heads/main/Mixes.wiki_userscripts_helper/script.user.js
// @require      https://cdn.rawgit.com/mixes-wiki/userscripts/refs/heads/main/includes/jquery-3.7.1.min.js
// @require      https://cdn.rawgit.com/mixes-wiki/userscripts/refs/heads/main/includes/waitForKeyElements.js
// @require      https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/includes/global.js?v-Mixes.wiki_1
// @match        https://www.mixes.wiki/*
// @noframes
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * User settings
 * You need to set these on each update, but updates happen rarely for this script
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Your Apple Music counry code, e.g. "de"
var countryCode_switch = "";

// Your Apple Music Beta preference
// Keep 0 to use music.apple.com
// Set 1 to use beta.music.apple.com (recommended)
var useBeta = 0;


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * ToDos
 * Only URLs that are supported by TrackId.net: SoundCloud, Mixcloud, YouTube, hearthis.at
 * Rewrite to not require jQuery
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * TrackId.net support
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * Quicker "Submit Request"
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

    // On click add request page url for the first visible player
    $("#pageIconPlayers.trackIdNet").click(function(){
        var linkIcon = $("#pageIcons a.trackIdNet");

        // Prevent URLs from adding up after 1st click
        // otherwise the URLs add up and on 2nd click more than 2 tabs open
        var hrefOrig = linkIcon.attr("data-hreforig");
        linkIcon.attr("href", hrefOrig);

        // On click
        var urlSearch = linkIcon.attr("href").replace(/ /g,"%20"),
            requestPlayerUrl = $(".playerWrapper:visible[data-playerurl]").first().attr("data-playerurl"), // first visible player
            keywords = (new URL(urlSearch)).searchParams.get('keywords');
        logVar( "urlSearch", urlSearch );
        logVar( "keywords", keywords );

        if( requestPlayerUrl ) {
            log( "requestPlayerUrl: " + requestPlayerUrl );
            var urlRequest = "https://trackid.net/submitrequest?requestUrl="+requestPlayerUrl+"&keywords="+keywords;

            linkIcon.attr("href", urlRequest).attr("data-hreforig", urlSearch);

            log( "URL changed to: " + multiUrl );
        } else {
            log( "No first player URL found" );
        }
    });
} else {
    log( "Criteria for mix page not matched." );
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Change Apple Music links on tracks
 * Force link to open in browser instead of the Music app
 * Change URL to Apple Music Beta and custom country code
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

waitForKeyElements(".aff-iconlink.AppleMusic:not(.processed-userscript)", waitTables);
function waitTables(jNode) {
    jNode.addClass("processed-userscript");

    // https://music.apple.com/us/album/lunch/1739659134?i=1739659140&uo=4&app=music&at=1000l5EX
    // https://music.apple.com/de/search?at=1000l5EX&term=Floating%20Points%20Fast%20Foward
    var item_url = jNode.attr("href").replace("&app=music","");

    // override country code
    logVar( "countryCode_switch", countryCode_switch );

    if( countryCode_switch != "" ) {
        item_url = item_url.replace( /music.apple.com\/..\//g, "music.apple.com/"+countryCode_switch+"/" );
    }

    // switch to beta
    logVar( "useBeta", useBeta );

    if( useBeta == 1 ) {
        item_url = item_url.replace( "music.apple.com", "beta.music.apple.com" );
    }

    // prepare url for switch
    if( countryCode_switch != "" || useBeta == 1 ) {
        jNode.attr( 'href', item_url );
    }
}
