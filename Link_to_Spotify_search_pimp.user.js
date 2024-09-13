// ==UserScript==
// @name         Link to Spotify search pimp
// @author       MixesDB
// @version      2024.07.13.1
// @description  'Link to Spotify search pimp' is replaced by 'Music Seek Helper'.
// @updateURL    https://www.mixes.wiki/tools/userscripts/Link_to_Spotify_search_pimp.user.js
// @downloadRL   https://www.mixes.wiki/tools/userscripts/Link_to_Spotify_search_pimp.user.js
// @match        http*://itunes.apple.com/*/playlist/*
// @match        http*://music.apple.com/*/playlist/*
// @match        http*://ra.co/reviews*
// @require      https://www.mixes.wiki/scripts/jquery/jquery-1.7.min.js
// @grant        none
// ==/UserScript==

alert( "'Link to Spotify search pimp' is replaced by 'Music Seek Helper'. Please remove 'Link to Spotify search pimp' from your browser. You are now redirected to 'Music Seek Helper'." );

window.location.href = "https://www.mixes.wiki/w/Help:Pimp_scripts#Music_Seek_Helper";
