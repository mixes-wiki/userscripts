// ==UserScript==
// @name         Apple Music (by Mixes.wiki)
// @author       User:Martin@Mixes.wiki (Subfader@GitHub)
// @version      2024.10.12.1
// @description  Change the look and behaviour of certain DJ culture related websites to help contributing to Mixes.wiki, e.g. add copy-paste ready tracklists in wiki syntax.
// @homepageURL  https://www.mixes.wiki/w/Help:Mixes.wiki_userscripts
// @supportURL   https://discord.com/channels/1258107262833262603/1261652338314055742
// @updateURL    https://cdn.rawgit.com/mixes-wiki/userscripts/refs/heads/main/Apple_Music/script.user.js
// @downloadRL   https://cdn.rawgit.com/mixes-wiki/userscripts/refs/heads/main/Apple_Music/script.user.js
// @require      https://cdn.rawgit.com/mixes-wiki/userscripts/refs/heads/main/includes/jquery-3.7.1.min.js
// @require      https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/includes/global.js
// @include      http*music.apple.com*
// @noframes
// @run-at       document-end
// ==/UserScript==

/*
 * User settings
 * You need to set these on each update, but updates happen rarely for this tiny script
 */

// Set your counry code, e.g. "de"
var countryCode_switch = "us";

// Keep 0 to use music.apple.com
// Set 1 to use beta.music.apple.com (recommended)
var useBeta = 0;

/*
 * URL switcher (country code and beta)
 */
$(document).ready(function(){
    if( countryCode_switch == "" ) {
        countryCode_switch = "us"
    }
    var current_url = $(location).attr("href"); // https://music.apple.com/us/album/double-standard/1741549977?i=1741550406
    var current_domain = document.location.hostname; // music.apple.com
    var current_countryCode = urlPath(1);

    logVar( "current_url", current_url );
    logVar( "current_domain", current_domain );
    logVar( "current_countryCode", current_countryCode );

    var domain = "music.apple.com",
        countryCode = current_countryCode,
        do_switch = 0;

    // switch country
    logVar( "countryCode_switch", countryCode_switch );

    if( current_countryCode != countryCode_switch ) {
        do_switch = 1;
        log( "switch country!" );
        var countryCode = countryCode_switch;
    }

    // switch to beta
    logVar( "useBeta", useBeta );

    if( current_domain != "beta.music.apple.com" && useBeta == 1 ) {
        do_switch = 1;
        var domain = "beta.music.apple.com";
    }

    // prepare url for switch
    logVar( "do_switch", do_switch );
    if( do_switch == 1 ) {
        var url = $(location).attr("href"),
            reg = (new RegExp(`^http.+music\.apple\.com\/${current_countryCode}\/(.+)`)),
            url_path = url.replace( reg, "$1" ),
            url_switch = "https://" + domain + "/" + countryCode + "/" + url_path;

        logVar( "url_switch", url_switch );

        // reload if URL changed
        if( current_url != url_switch ) {
            $(location).attr( 'href', url_switch );
        }
    }
});
