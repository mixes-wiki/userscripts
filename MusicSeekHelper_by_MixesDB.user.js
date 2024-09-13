// ==UserScript==
// @name         Music Seek Helper (by MixesDB)
// @author       MixesDB
// @version      2024.07.13.1
// @description  For playlists and reviews on various websites, create links to the Spotify, Apple Music or TIDAL search
// @homepageURL  https://www.mixes.wiki/w/Help:Pimp_scripts
// @supportURL   https://www.mixes.wiki/w/MixesDB:Forum/Pimp_scripts
// @updateURL    https://www.mixes.wiki/tools/userscripts/MusicSeekHelper_by_MixesDB.user.js
// @downloadURL  https://www.mixes.wiki/tools/userscripts/MusicSeekHelper_by_MixesDB.user.js
// @match        http*://music.apple.com/*
// @match        http*://open.spotify.com/*
// @match        http*://ra.co/*
// @require      https://www.mixes.wiki/scripts/jquery/jquery-1.7.min.js
// @require      https://www.mixes.wiki/scripts/waitForKeyElements/waitForKeyElements.js
// @require      https://www.mixes.wiki/scripts/js-cookie/latest.js?1
// @require      https://www.mixes.wiki/scripts/modules/MusicSeekHelper_funcs.js?2
// @grant        none
// ==/UserScript==

// Cannot create Apple Music links to search that open in the app
// https://discussions.apple.com/thread/253029385

/*
 * CSS
 */
var animationDur = 400,
    css = ".mixesDBorange, .mixesDBorange *, .mdb-fake-link {color: #f60 !important} .center {text-align:center} .top5 {margin-top:5px} .mdb-fake-link, button, .hand, .musicSeekHelper-action {cursor: pointer} abbr {cursor: help} .nobr{white-space:nowrap}";
    css += "#dt-modal-container, .dt-modal__dialog-content[aria-label='Subscription'] {display:none} .upsell-banner, div[aria-label='Explicit'] {display:none !important}";
    css += ".songs-list-row__add-to-library{opacity:1 !important;}.musicSeekHelper-wrapper{display:table}.musicSeekHelper-wrapper div{display:table-cell}.musicSeekHelper-action{opacity:.3;margin-left:10px}.musicSeekHelper-action.am{margin-right:-2px}.musicSeekHelper-link.am{opacity:.375}.on-am .musicSeekHelper-link{opacity:.25}.musicSeekHelper-action:hover{cursor:pointer;opacity:.7}.musicSeekHelper-action[data-check-status='1']{opacity:.975}.musicSeekHelper-link.td img{border-radius:20%}.musicSeekHelper-link.td:hover,.musicSeekHelper-link.td.checked{filter:invert(.82)}.musicSeekHelper-link-wrapper{border-top:none!important;margin-top:-1px}.musicSeekHelper-wrapper.on-am{margin-left:-25px}.musicSeekHelper-wrapper.on-am *{outline:0!important;line-height:0!important}.musicSeekHelper-wrapper.album.on-am{margin:10px 0 0 -10px}.on-am .musicSeekHelper-markChecked-wrapper{padding-top:.2em!important}.songs-list-row.selected .on-am .musicSeekHelper-markChecked:not([data-check-status='1']){-webkit-filter:grayscale(100%) brightness(140%) sepia(90%) hue-rotate(3deg) saturate(100%) contrast(1);filter:grayscale(100%) brightness(140%) sepia(90%) hue-rotate(3deg) saturate(100%) contrast(1);opacity:.6}.songs-list-row.selected .on-am .musicSeekHelper-markChecked[data-check-status='1']{-webkit-filter:grayscale(100%) brightness(140%) sepia(70%) hue-rotate(3deg) saturate(800%) contrast(1);filter:grayscale(100%) brightness(140%) sepia(70%) hue-rotate(3deg) saturate(800%) contrast(1);opacity:1}.on-sp .musicSeekHelper-markChecked:not([data-check-status='1']):not(:hover){opacity:.325!important}.songs-list-row--selected .musicSeekHelper-markChecked{filter:brightness(1.75)}.on-sp .musicSeekHelper-markChecked:not([data-check-status='1']):hover{opacity:.85}#musicSeekHelper-dialogArea #userPwForm-change:active,#musicSeekHelper-dialogArea #userPwForm-change:hover,.on-sp .musicSeekHelper-markChecked[data-check-status='1']{opacity:1}.on-sp .musicSeekHelper-link[data-check-status='1']{opacity:.875}.on-ra .musicSeekHelper-link.musicSeekHelper-link-ra:not([data-check-status='1']){opacity:.325}#musicSeekHelper-dialogArea{padding-bottom:10px}.musicSeekHelper-dialogArea-section{padding-top:15px}#musicSeekHelper-dialogArea form{display:inline}input#musicSeekHelper-active{margin-left:8px}#musicSeekHelper-dialogArea input:active,#musicSeekHelper-dialogArea input:focus{outline:0!important}#dialogArea-addonWarning>p{padding-bottom:5px}#dialogArea-options>p{padding-bottom:6px}#dialogArea-options input[type=checkbox]{float:left;width:15px;margin-top:3px}#dialogArea-options label{display:block;padding-left:21px}#musicSeekHelper-dialogArea #userPwForm-input{margin-top:9px;height:32px;border-radius:4px;border-width:1px;width:100%;padding:6px 5px;font-family:monospace;font-size:12px;line-height:1.25}#musicSeekHelper-dialogArea #userPwForm-change{float:right;opacity:.5;font-size:11px}#musicSeekHelper-dialogArea #userPwForm-submit{margin-top:7px;height:32px;width:100%;display:block}#musicSeekHelper-dialogArea #userPwForm-change,#musicSeekHelper-dialogArea #userPwForm-submit{cursor:pointer}.web-navigation textarea{font-family:inherit}.musicSeekHelper-wrapper.playlist.on-am{margin-left:-60px}.musicSeekHelper-wrapper.playlist.on-am .musicSeekHelper-link-wrapper:last-of-type{padding-right:5px}.product-header .product-meta{height:35px}.product-header .musicSeekHelper-wrapper.on-am{margin:9px 0 0 -6px}.preview-button__tracklist,.songs-list-row__add-to-library .web-add-to-library{display:none}#musicSeekHelper-dialogArea.on-am{width:100%;line-height:1.3em;padding:15px 25px 20px;border-top:.5px solid var(--labelDivider);letter-spacing:-.013em}#musicSeekHelper-dialogArea.on-am #dialogArea-options label small,#musicSeekHelper-dialogArea.on-am #dialogArea-options li+li,#musicSeekHelper-dialogArea.on-am #userPwForm-input-help,#musicSeekHelper-dialogArea.on-sp #dialogArea-options li+li{margin-top:5px}#musicSeekHelper-dialogArea.on-am #dialogArea-options label small,#musicSeekHelper-dialogArea.on-am #userPwForm-change-help{opacity:.75;font-size:11px;display:inline-block}#musicSeekHelper-dialogArea.on-am #userPwForm-change-help{margin-top:7px;margin-bottom:3px}#musicSeekHelper-dialogArea.on-am #dialogArea-addonWarning ul{margin-top:3px;padding-left:16px;list-style-type:circle}#musicSeekHelper-dialogArea.on-am #dialogArea-addonWarning ul li{display:list-item;list-style:circle}#musicSeekHelper-dialogArea.on-am .tip{color:var(--systemBlue-vibrant)}#musicSeekHelper-dialogArea.on-am #userPwForm-input{border-color:var(--searchBarBorderColor)}#actionButtons-outsideDialogArea.on-am button,#dialogArea-actionButtons button,#musicSeekHelper-dialogArea.on-am #userPwForm-change,#musicSeekHelper-dialogArea.on-am #userPwForm-submit{background:#007aff;color:#fff;border:none;text-align:center;border-radius:4px;padding:0 10px;cursor:pointer}#actionButtons-outsideDialogArea.on-am button,#dialogArea-actionButtons button,#musicSeekHelper-dialogArea.on-am #userPwForm-submit{min-width:30px;-webkit-appearance:none;-moz-appearance:none;appearance:none;text-decoration:none;white-space:nowrap;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;font-size:13px;font-weight:500;letter-spacing:-.013em;line-height:32px}#actionButtons-outsideDialogArea.on-am{display:block;text-align:center;margin:30px auto -10px 0!important}#actionButtons-outsideDialogArea.on-am button{font-size:1.17em;padding:.17em 1em .2em}.artist-header__name .musicSeekHelper-action img{transform:translateY(5px)}.songs-list-row__add-to-library.fake{width:inherit;margin:0}.songs-list-row__add-to-library.fake .musicSeekHelper-wrapper.on-am{margin-left:-100px}.songs-list-row--web-preview:focus .songs-list-row__length,.songs-list-row--web-preview:focus-within .songs-list-row__length,.songs-list-row--web-preview:hover .songs-list-row__length{opacity:1}.Root__nav-bar{margin-top:-16px}div[data-testid=rootlist-container]{margin-top:0}#musicSeekHelper-dialogArea.on-ra #musicSeekHelper-option-markCheckedOnPlay-wrapper,#musicSeekHelper-dialogArea.on-ra #musicSeekHelper-option-searchOnPlay-wrapper,.Root__nav-bar div[data-testid=rootlist-container] button[data-testid=create-playlist-button],.Root__nav-bar>div>div:last-of-type,.Root__nav-bar>div>div[role=banner],.product-page-header__metadata .truncated_content-in-modal__opener{display:none}.main-view-container h1{font-size:42px!important;line-height:1em!important}section[data-testid=album-page]>div:first-of-type,section[data-testid=artist-page]>div>div,section[data-testid=playlist-page]>div:first-of-type{height:inherit!important;max-height:inherit!important}section[data-testid=album-page]>div:first-of-type,section[data-testid=playlist-page]>div:first-of-type{min-height:285px!important;padding-top:10px}section[data-testid=artist-page]>div>div{min-height:280px!important}div[data-testid=playlist-image] div img,section[data-testid=album-page]>div>div>div>img{border-radius:.6em}div img[data-testid=card-image],div.cover-art.shadow img[data-testid=cover-art-image],section[data-testid=component-shelf]>div>div{border-radius:7px!important}div[data-testid=tracklist-row] img{border-radius:5px!important}div.cover-art.shadow,div[data-testid=tracklist-row],section[data-testid=component-shelf] div div div{background-color:transparent}.product-page-header__metadata--notes{max-width:inherit;opacity:.5}#musicSeekHelper-dialogArea.on-sp .tip{color:#1db954}#actionButtons-outsideDialogArea.on-sp button,#musicSeekHelper-dialogArea.on-sp #userPwForm-change,#musicSeekHelper-dialogArea.on-sp #userPwForm-submit{background-color:#1db954}.musicSeekHelper-wrapper.playlist.on-sp{float:right;padding-top:19px;padding-right:0}.musicSeekHelper-wrapper.album.on-sp{margin:6px 0 -5px -8px}#musicSeekHelper-dialogArea.on-sp{padding-top:6px!important;font-size:80%;margin-top:10px;border-top:1px solid rgba(255,255,255,.1);background-color:#181818;padding-left:15px;padding-right:15px;line-height:1.2em}#musicSeekHelper-dialogArea.on-sp h3{font-size:15px}#musicSeekHelper-dialogArea.on-sp #musicSeekHelper-active{margin-bottom:-1px!important;line-height:.9em}#musicSeekHelper-dialogArea.on-sp #dialogArea-options label{padding-top:2px;margin-left:3px}#musicSeekHelper-dialogArea.on-sp #userPwForm-input{background-color:#ddd;margin-bottom:5px}#musicSeekHelper-dialogArea.on-sp #userPwForm-change,#musicSeekHelper-dialogArea.on-sp #userPwForm-submit{border:0;color:#fff;border-radius:.4em;opacity:1;padding:2px 8px 3px}#musicSeekHelper-dialogArea.on-sp #userPwForm-change{background-color:transparent;border:1px solid rgba(255,255,255,.3)}#musicSeekHelper-dialogArea.on-sp #userPwForm-change:hover{border-color:#fff}#actionButtons-outsideDialogArea.on-sp button{padding:.4em .8em;border:0;color:#fff;border-radius:.3em}h1.artist-header__product-title-product-name .musicSeekHelper-action.on-am img{margin-top:7px}#musicSeekHelper-dialogArea.on-ra{color:#666;font-family:Helvetica;font-size:85%;line-height:1.3em;float:left;max-width:220px;padding:60px 10px 20px}div[data-tracking-id=music-home] #musicSeekHelper-dialogArea.on-ra{padding:20px 0 0;max-width:inherit;display:block}div[data-tracking-id=music-home] #musicSeekHelper-dialogArea.on-ra #dialogArea-options,div[data-tracking-id=music-home] #musicSeekHelper-dialogArea.on-ra #musicSeekHelper-dialogArea-title,div[data-tracking-id=music-home] #musicSeekHelper-dialogArea.on-ra .musicSeekHelper-dialogArea-section{padding:0 20px 0 0;display:inline-block;float:left;vertical-align:top}#musicSeekHelper-dialogArea.on-ra.detailPage{padding-top:0!important}#musicSeekHelper-dialogArea.on-ra #userPwForm-input{margin-top:9px;height:20px;margin-bottom:5px;width:calc(100% - 10px)}.musicSeekHelper-action.on-ra{margin-left:.15em}";
$("head").append('<style type="text/css">'+ css +'</style>');


/*
 * Basics
 */
// xc()
function xc( t ) {
    console.log( t );
}

var apiUrlTools = 'https://www.mixes.wiki/tools/api/api.php';

// supress confirm leaving page popup
$(document).ready(function() {
    window.addEventListener('beforeunload', function (e) {
        // the absence of a returnValue property on the event will guarantee the browser unload happens
        delete e['returnValue'];
    });
});

// urlPath()
function urlPath(n) {
    return $(location).attr('href').split('/')[n+2];
}
var url = $(location).attr('href'),
    domain = urlPath(0).replace(/.+\.(.+\.[a-z0-9]+)/gi, '$1'),
    subdomain = urlPath(0);

// getURLParameter()
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]'+name+'=' +
'([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g,
'%20'))||null;
}

// hexToRgb
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    
    // Correct string should be like: "rgb(6, 137, 203)" <-- note the spaces
    return "rgb(" + 
        parseInt(result[1], 16) + ", " + 
        parseInt(result[2], 16) + ", " +
        parseInt(result[3], 16) + ")";
}

// open fake links
function triggerFakeLinks() {
    $(".mdb-fake-link").each(function() {
        var url = $(this).attr("data-href");
        $(this).attr("title", url);
    });
    $(".mdb-fake-link").click(function() {
        var url = $(this).attr("data-href"),
            win = window.open( url, '_blank' );
        xc( url );
        if( win ) win.focus();
    });
}

// onOptionsChange()
function onOptionsChange() {
    $( "#dialogArea-options input" ).change(function() {
        var name = $(this).attr("id"),
            val = ( $(this).is(':checked') );
        if( name !== null && val !== null ) {
            Cookies.set( name, val, { expires: 365, domain: domain } );
        }
    });
}


/*
 * apiError()
 */
function apiError() {
    $("#dialogArea-addonWarning").show();
    alert( "Cannot connect to database. You need to enable browser addons and reload the page. Also, if you use a script blocker addon, allow www.mixes.wiki." );
}


/*
 * API response check
 */
function apiResponseCheck() {
    $.ajax({ type: "POST", url: apiUrlTools, data: { query: "responseCheck" }})
        .fail(function() { apiError(); })
        .done(function(data) { if( data === null || data != "working" ) apiError();
    });
}


/*
 * cookie values
 */
// password
var userPw = ( typeof( Cookies.get("musicSeekHelper-userId") ) !== "undefined" ) ? Cookies.get("musicSeekHelper-userId") : '',
    userPwSecuredFirstTwo = userPw.replace(/^(..).+$/g,'$1'),
    userPwSecured = Array(userPw.length+1).join("*").replace(/^(.{2})(.+)$/g,userPwSecuredFirstTwo+'$2');
//xc( "userPw init: " + userPw );

// optActive
var optActive = "musicSeekHelper-active";

if( typeof( Cookies.get(optActive) ) === "undefined" ) {
    Cookies.set( optActive, "true", { expires: 365, domain: domain } );
}
var globalActive = ( Cookies.get( optActive ) != "false" ) ? true : false;
//xc( "globalActive init: " + globalActive );

// openLinksInBrowser
var openLinksInBrowser = ( Cookies.get( "musicSeekHelper-option-openLinksInBrowser" ) == "true" ) ? true : false;


/*
 * domain specific variables
 */
switch(domain) {
    case "apple.com":
        var onDomain = "on-am",
            thisSitename = "Apple Music",
            searchTargetName = "TIDAL";
        break;

    case "spotify.com":
        var onDomain = "on-sp",
            thisSitename = "Spotify",
            searchTargetName = "TIDAL";
        break;

    case "tidal.com":
        var onDomain = "on-td",
            thisSitename = "TIDAL",
            searchTargetName = "Spotify";
        break;

    case "ra.co":
        var onDomain = "on-ra",
            thisSitename = "RA",
            searchTargetName = "Music";
        break;
}


/*
 * makeIcon()
 * userPw gets checked later on click
 */
function makeIcon( iconType, type, artist, title, className, size=18, preferredSearchType ) {   
    if( artist !== "" || title !== "" ) {
        //xc( "artist passed: " + artist );
        //xc( "title passed: " + title );
        
        var artistSearch = artist /* COPY FROM MediaWiki:Common.js */
                                .trim()
                                .replace(/( )+/g, " ")
                                .replace(/(.+) - .+/g, "$1")
                                .replace(/^(\+\s?|ID|\?+|Unknown|VA|N\/A)$/g, "")
                                .replace("+ ?", "")
                                .replace(/ [au]nd /g, " ")
                                .replace(/ (Feat\.|&|x|and|vs\.?|Pres\.) .{2,}$/gi, " ")
                                .replace(/^Various( -)?( )*$/g, "")
                                .replace(/^Various \((.+)\)$/g, "")
                                .replace(/[,]/g, "")
                                .trim(),
            titleSearch = title
                               .trim()
                               .replace(/( |^)- /g, " ")
                               .replace(/^(ID|\?+|Unknown|Untitled|CDR|Promo)$/gi, "")
                               .replace(/^Untitled [A-Z][0-9]?[0-9]?/, "")
                               .replace(/^Untitled \([A-Z][0-9]?[0-9]?\)/, "")
                               .replace(/( \(| - | )Original.*( Mix)?\)?/gi, "")
                               .replace(/ \(?(Feat\.|Pres\.) .{2,}\)?( \[.{2,}\])?$/gi, " ")
                               .replace(/ \([A-Za-z]+\)$/gi, "") // "Artist (Italy)"
                               .replace(/[()]/gi, "")
                               .replace(/([A-Za-z]):/gi, "$1") // Not song names like "05:23" 
                               .trim();
        //xc( "artist replaced: " + artist );
        //xc( "title replaced: " + title );
        
        if( artistSearch != "" ) {
            var query = encodeURIComponent(artistSearch)+'%20'+encodeURIComponent(titleSearch);
        } else {
            var query = encodeURIComponent(titleSearch);
        }
        var from = "musicSeekHelper-From=link";
        
        switch( type ) {
            // Spotify
            case "Spotify":
                var searchTargetId = "sp",
                    href = 'data-href="spotify:search:' + query + '"',
                    hrefBrowser = 'data-hrefbrowser="https://open.spotify.com/search/' + query + '?' + from + '"';
                
                if( preferredSearchType == "artists" ) {
                    hrefBrowser = 'data-hrefbrowser="https://open.spotify.com/search/' + query + '/artists/?' + from + '"';
                }
                break;
                
            // Apple Music
            case "Apple Music":
                //var urlProtocl = "musics://";
                var searchTargetId = "am",
                    url = 'https://music.apple.com/search?at=1000l5EX&' + from + '&term=' + query + '"',
                    href = 'data-href="' +url+ '"',
                    hrefBrowser = 'data-hrefbrowser="' +url+ '"';
            break;
            
            // TIDAL
            case "TIDAL":
                var searchTargetId = "td",
                    href = 'data-href="tidal:search:' + query + '"',
                    hrefBrowser = 'data-hrefbrowser="https://listen.tidal.com/search?q=' + query + '"';
                
                if( preferredSearchType == "albums" ) { // album tab often finds nothing while title tab does
                    href = 'data-href="tidal:search:albums:' + query + '"';
                    hrefBrowser = 'data-hrefbrowser="https://listen.tidal.com/search/albums?q=' + query + '"';
                }
                if( preferredSearchType == "artists" ) {
                    href = 'data-href="tidal:search:artists:' + query + '"';
                    hrefBrowser = 'data-hrefbrowser="https://listen.tidal.com/search/artists?q=' + query + '"';
                }
                break;
        }
        
        className += " "+ searchTargetId +" "+ onDomain;
        className = className.trim();

        var dimensions = 'width="'+size+'" height="'+size+'"',
            img = '<img '+dimensions+' src="https://www.mixes.wiki/static/images/icons/Spotify_2018_96.png">';
        
        if( artistSearch != "" ) {
            var artistTitle = encodeURIComponent(artistSearch) +"%20"+ encodeURIComponent(titleSearch);
        } else {
            var artistTitle = encodeURIComponent(titleSearch);
        }
        
        var artistTitle = artistTitle.replace(/'/g,""),
            dataString = 'data-stringid="'+artistTitle+'"',
            dataSearchTargetId = 'data-searchtargetid="'+searchTargetId+'"',
            dataTargetSite = ( type != "" ) ? 'data-targetsite="'+type+'"' : '';
        
        if( artistSearch != "" ) {
            var title = 'title="'+ artistSearch +' '+ titleSearch +'"';
        } else {
            var title = 'title="'+ titleSearch +'"';
        }
                
        if( type == "Apple Music" ) {
            href += "";
            //href += "app=itunes";
        }

        switch( iconType ) {
            case "searchLink":
                if( type == "Spotify" ) {
                    var icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyMAAAMjCAMAAACBDT/3AAAKQ2lDQ1BJQ0MgcHJvZmlsZQAAeNqdU3dYk/cWPt/3ZQ9WQtjwsZdsgQAiI6wIyBBZohCSAGGEEBJAxYWIClYUFRGcSFXEgtUKSJ2I4qAouGdBiohai1VcOO4f3Ke1fXrv7e371/u855zn/M55zw+AERImkeaiagA5UoU8Otgfj09IxMm9gAIVSOAEIBDmy8JnBcUAAPADeXh+dLA//AGvbwACAHDVLiQSx+H/g7pQJlcAIJEA4CIS5wsBkFIAyC5UyBQAyBgAsFOzZAoAlAAAbHl8QiIAqg0A7PRJPgUA2KmT3BcA2KIcqQgAjQEAmShHJAJAuwBgVYFSLALAwgCgrEAiLgTArgGAWbYyRwKAvQUAdo5YkA9AYACAmUIszAAgOAIAQx4TzQMgTAOgMNK/4KlfcIW4SAEAwMuVzZdL0jMUuJXQGnfy8ODiIeLCbLFCYRcpEGYJ5CKcl5sjE0jnA0zODAAAGvnRwf44P5Dn5uTh5mbnbO/0xaL+a/BvIj4h8d/+vIwCBAAQTs/v2l/l5dYDcMcBsHW/a6lbANpWAGjf+V0z2wmgWgrQevmLeTj8QB6eoVDIPB0cCgsL7SViob0w44s+/zPhb+CLfvb8QB7+23rwAHGaQJmtwKOD/XFhbnauUo7nywRCMW735yP+x4V//Y4p0eI0sVwsFYrxWIm4UCJNx3m5UpFEIcmV4hLpfzLxH5b9CZN3DQCshk/ATrYHtctswH7uAQKLDljSdgBAfvMtjBoLkQAQZzQyefcAAJO/+Y9AKwEAzZek4wAAvOgYXKiUF0zGCAAARKCBKrBBBwzBFKzADpzBHbzAFwJhBkRADCTAPBBCBuSAHAqhGJZBGVTAOtgEtbADGqARmuEQtMExOA3n4BJcgetwFwZgGJ7CGLyGCQRByAgTYSE6iBFijtgizggXmY4EImFINJKApCDpiBRRIsXIcqQCqUJqkV1II/ItchQ5jVxA+pDbyCAyivyKvEcxlIGyUQPUAnVAuagfGorGoHPRdDQPXYCWomvRGrQePYC2oqfRS+h1dAB9io5jgNExDmaM2WFcjIdFYIlYGibHFmPlWDVWjzVjHVg3dhUbwJ5h7wgkAouAE+wIXoQQwmyCkJBHWExYQ6gl7CO0EroIVwmDhDHCJyKTqE+0JXoS+cR4YjqxkFhGrCbuIR4hniVeJw4TX5NIJA7JkuROCiElkDJJC0lrSNtILaRTpD7SEGmcTCbrkG3J3uQIsoCsIJeRt5APkE+S+8nD5LcUOsWI4kwJoiRSpJQSSjVlP+UEpZ8yQpmgqlHNqZ7UCKqIOp9aSW2gdlAvU4epEzR1miXNmxZDy6Qto9XQmmlnafdoL+l0ugndgx5Fl9CX0mvoB+nn6YP0dwwNhg2Dx0hiKBlrGXsZpxi3GS+ZTKYF05eZyFQw1zIbmWeYD5hvVVgq9ip8FZHKEpU6lVaVfpXnqlRVc1U/1XmqC1SrVQ+rXlZ9pkZVs1DjqQnUFqvVqR1Vu6k2rs5Sd1KPUM9RX6O+X/2C+mMNsoaFRqCGSKNUY7fGGY0hFsYyZfFYQtZyVgPrLGuYTWJbsvnsTHYF+xt2L3tMU0NzqmasZpFmneZxzQEOxrHg8DnZnErOIc4NznstAy0/LbHWaq1mrX6tN9p62r7aYu1y7Rbt69rvdXCdQJ0snfU6bTr3dQm6NrpRuoW623XP6j7TY+t56Qn1yvUO6d3RR/Vt9KP1F+rv1u/RHzcwNAg2kBlsMThj8MyQY+hrmGm40fCE4agRy2i6kcRoo9FJoye4Ju6HZ+M1eBc+ZqxvHGKsNN5l3Gs8YWJpMtukxKTF5L4pzZRrmma60bTTdMzMyCzcrNisyeyOOdWca55hvtm82/yNhaVFnMVKizaLx5balnzLBZZNlvesmFY+VnlW9VbXrEnWXOss623WV2xQG1ebDJs6m8u2qK2brcR2m23fFOIUjynSKfVTbtox7PzsCuya7AbtOfZh9iX2bfbPHcwcEh3WO3Q7fHJ0dcx2bHC866ThNMOpxKnD6VdnG2ehc53zNRemS5DLEpd2lxdTbaeKp26fesuV5RruutK10/Wjm7ub3K3ZbdTdzD3Ffav7TS6bG8ldwz3vQfTw91jicczjnaebp8LzkOcvXnZeWV77vR5Ps5wmntYwbcjbxFvgvct7YDo+PWX6zukDPsY+Ap96n4e+pr4i3z2+I37Wfpl+B/ye+zv6y/2P+L/hefIW8U4FYAHBAeUBvYEagbMDawMfBJkEpQc1BY0FuwYvDD4VQgwJDVkfcpNvwBfyG/ljM9xnLJrRFcoInRVaG/owzCZMHtYRjobPCN8Qfm+m+UzpzLYIiOBHbIi4H2kZmRf5fRQpKjKqLupRtFN0cXT3LNas5Fn7Z72O8Y+pjLk722q2cnZnrGpsUmxj7Ju4gLiquIF4h/hF8ZcSdBMkCe2J5MTYxD2J43MC52yaM5zkmlSWdGOu5dyiuRfm6c7Lnnc8WTVZkHw4hZgSl7I/5YMgQlAvGE/lp25NHRPyhJuFT0W+oo2iUbG3uEo8kuadVpX2ON07fUP6aIZPRnXGMwlPUit5kRmSuSPzTVZE1t6sz9lx2S05lJyUnKNSDWmWtCvXMLcot09mKyuTDeR55m3KG5OHyvfkI/lz89sVbIVM0aO0Uq5QDhZML6greFsYW3i4SL1IWtQz32b+6vkjC4IWfL2QsFC4sLPYuHhZ8eAiv0W7FiOLUxd3LjFdUrpkeGnw0n3LaMuylv1Q4lhSVfJqedzyjlKD0qWlQyuCVzSVqZTJy26u9Fq5YxVhlWRV72qX1VtWfyoXlV+scKyorviwRrjm4ldOX9V89Xlt2treSrfK7etI66Trbqz3Wb+vSr1qQdXQhvANrRvxjeUbX21K3nShemr1js20zcrNAzVhNe1bzLas2/KhNqP2ep1/XctW/a2rt77ZJtrWv913e/MOgx0VO97vlOy8tSt4V2u9RX31btLugt2PGmIbur/mft24R3dPxZ6Pe6V7B/ZF7+tqdG9s3K+/v7IJbVI2jR5IOnDlm4Bv2pvtmne1cFoqDsJB5cEn36Z8e+NQ6KHOw9zDzd+Zf7f1COtIeSvSOr91rC2jbaA9ob3v6IyjnR1eHUe+t/9+7zHjY3XHNY9XnqCdKD3x+eSCk+OnZKeenU4/PdSZ3Hn3TPyZa11RXb1nQ8+ePxd07ky3X/fJ897nj13wvHD0Ivdi2yW3S609rj1HfnD94UivW2/rZffL7Vc8rnT0Tes70e/Tf/pqwNVz1/jXLl2feb3vxuwbt24m3Ry4Jbr1+Hb27Rd3Cu5M3F16j3iv/L7a/eoH+g/qf7T+sWXAbeD4YMBgz8NZD+8OCYee/pT/04fh0kfMR9UjRiONj50fHxsNGr3yZM6T4aeypxPPyn5W/3nrc6vn3/3i+0vPWPzY8Av5i8+/rnmp83Lvq6mvOscjxx+8znk98ab8rc7bfe+477rfx70fmSj8QP5Q89H6Y8en0E/3Pud8/vwv94Tz+4A5JREAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADKWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4wLWMwMDEgNzkuYzAyMDRiMmRlZiwgMjAyMy8wMi8wMi0xMjoxNDoyNCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjMgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUM5QjZENkFDQTI3MTFFREE2MzdENzIxMkUzMEUwNzgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUM5QjZENkJDQTI3MTFFREE2MzdENzIxMkUzMEUwNzgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozM0NDOTY3RkNBMjUxMUVEQTYzN0Q3MjEyRTMwRTA3OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozM0NDOTY4MENBMjUxMUVEQTYzN0Q3MjEyRTMwRTA3OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Prtta9sAAAAYUExURQDcTdr65RoUFI/wsQJYKUTlfACcPP///yIJ1mIAAAAIdFJOU/////////8A3oO9WQAAGS1JREFUeNrs3Yty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';
                }

                if( type == "Apple Music" ) {
                    var icon = 'data:image/webp;base64,UklGRpQFAABXRUJQVlA4WAoAAAAQAAAAXwAAXwAAQUxQSDoBAAABf8K0kSRH33MePn3k809xdj+JiMitiihYA+9k52/ESegQQi5YHhSyfsh4kIuYWIgQBixJsk1ba1/btm3bvvecnv9srrl+X7yI/ic9Fd5sf48fb9tpr6A3VcHKAiyWFb+S3rE2NmCzbtrppSoyBqtpTE3PtbkDmJ2KWnpmbEhgJzVN9KhrgmVLT/eqggyWcklFd6EDmB6jdDMPwXZqo4uyDsYNJZ39azDeBEiUwbosnDOwnruS4C0nemDe3YH5Dv////ncgvm+A+aDuAzeKccMrOcuUQHrsqDABozXfjorG2DcUNLFMgbbqY1u4SOYHiJ0pypIYCnlVXSvqYJlQ0uPhroEdlLDSM+0uQOYHYtaeq6KTMBqFFXTS0t9DTarmoXeUfrLC7BYlH0KelO4070dfrwfZDyCngIAAFZQOCA0BAAAkBkAnQEqYABgAD5tLpVHpCIiISqxWwCADYlmAMxV2n8d+IHdac38B+KH4u/MDWH8B+IedZu3/I/bl2qvEx/w/U+8wH62fqr2Gv8x6gH+S/wHWo+hB5bHssfuT6NH//vTT7ZXk76u1J3AHaE5Mtdcz7y8fTnop+kd1AH6ACi3bdPjs2fF4ugQyOGlm9+BMkmmJ5L67odKM45YdAQa4Rip8KBwAj/xlhF5emxfZOQbtOjPPlIXhna4N5LnCYyJ7Lt6xUyqOnQxkc/RIXwQD7DLAy31yz0AAP7+9nrz+1hjO4zrjGjZEiknO1h0vdcGsarRLp88I+tmS0U8ZYnSrcbHONdqo9urojtzm8zqcAA+DR2inX/NPFp8AQHQLKfqTf7eBqLEPBZyRv52XSPsiKtpKMcGkBKTmnU6t/rqLXP4WbV4CQY0EiHqTow/+OlSiz4daNvE7s4y/3NgzmsT0JlEr4adlwH7wgYCwWq3cIQti6yjGP74gGfISJUoyHZyV5NHBKhqPtzEWV3jDWWhsOPl/ECCnOLMLIZ1+JYoaEOR7i+8Zfwgf6J+0He6/771GjfI3OmJtaBj7AOFKUj9CWm4bttO7OqwQ7LS5L5QjtnPyILGvgztV2wfdn7elSbgoeOa68kaX/1JjqCS+rnhUOXJ2DsFp9mmRN1Tp5sm7v7DvqeVMDxXnOzohTwa1DS9tQb3opstVaoffNOWg2juMcs7v6lni6d+8xppZ+KQk/fJQ9TjTP0F5vltg5CviYYQZPydFCSVf4Rz/Qvl4o7L5meAXAWXHNl8rDtistkhHvpoTsz2Bswblk2GxaoR4K13UWd3AE/ndmCZUEEaDNbeFdGLQldbkvnpoKRH7qUPAdFEKiLh/Z1eJwFE6MpeTAEWQrK9FS8q+6lyBkpcx/4N3DNNiiO0GmNl/7Bh9MdmeEc5c/lEX84SZ1wXXVwRUhdC2wlSUa0Tpm1vSO7+EzAr161a70312MuVRB2q490xPKzfzguLcfkLjxq0rWhoD75cb7319/kqMGgEOSFCkKK9HJO/TBrOGRu/u3tiKmYHoTibqedCajKPaowcLsbFMjPzqynEn9mT3/Cedj5zBsDUtKc5L1Y98O+3vF/GF9ytlS+KJU30in+gq96v8IZmP6WCX43i8V1NYC/KJ96wbT5g7cNT8bQ961qHjlME4QRR7C1H+c6btjTsjXPQ+RDn9CVWIdeWyyv1JVQBdiEJ3AASzDmONZ2UIK0UGOyX8EFR2tzsfQUjCIF6jgIyWDKsVNWPOO1VdYGJWWV3UvjRQjBQSPwTmSSp6KmYvZaz23/oPNI23aRPXGw7eXh/62FxWTLl/WySAAD3FD8lQtCG78CTv5rNSc1J4BF3PQanYx6bA5vY3O/WPpHm1/Af/r1MwLuT2BvMgFQtsp/KGeAO2QyH1I3a6pQAAAA=';
                }
                if( type == "TIDAL" ) {
                    var icon = 'data:image/png;base64,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UmVhZHlxyWU8AAADKWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4wLWMwMDEgNzkuYzAyMDRiMmRlZiwgMjAyMy8wMi8wMi0xMjoxNDoyNCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjMgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OERERTE5ODNDN0UzMTFFRDg0MzlDM0QwNEUzODdBQzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OERERTE5ODRDN0UzMTFFRDg0MzlDM0QwNEUzODdBQzEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4RERFMTk4MUM3RTMxMUVEODQzOUMzRDA0RTM4N0FDMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4RERFMTk4MkM3RTMxMUVEODQzOUMzRDA0RTM4N0FDMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhkPhGsAAAH+UExURQAAAP///w4ODgEAAAABAA8ODgAAARQUFLS0tAEBASQkJBsbG5KSkrOzs9nZ2Tw8PE5OTicnJw0NDQ4OD+bm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';
                }

                var link = '<span class="musicSeekHelper-action musicSeekHelper-link '+className+'" '+href+' '+hrefBrowser+' '+dataTargetSite+' '+dataSearchTargetId+' '+dataString+' '+title+'><img src="'+icon+'" '+dimensions+'></span>';
                break;
                
            case "markChecked":
                var icon = 'data:image/png;base64,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',
                    link = '<span class="musicSeekHelper-action musicSeekHelper-markChecked '+className+'" '+dataTargetSite+' '+dataSearchTargetId+' '+dataString+' '+title+'><img src="'+icon+'" '+dimensions+'></span>';
                break;
        }
        
        // return link if not empty
        if( artistTitle != "%E2%80%8C-%E2%80%8C" ) {
            return link;
        }
    }
}


/*
 * Search link after click
 */
function actionLinkChecked( e, status, confirmTitle ) {
    e.attr("title", confirmTitle);
    e.addClass("checked");
    e.attr("data-check-status",status);
}

// songName_queue()
var songNameQueue =  [];
function songName_queue( songName="", action ) {
    if( songName != "" ) {
        /*
        xc( "songName_queue before: (" +songNameQueue.length+ "): " + songNameQueue );
        xc( action );
        xc( songName );
        */
        switch(action) {
            case "add":
                songNameQueue.push( songName );
                break;
                
            case "remove":
                songNameQueue = jQuery.grep(songNameQueue, function(value) {
                    return value != songName;
                });
                break;
        }
        songNameQueue = songNameQueue.unique();
        //xc( "songName_queue after:  (" +songNameQueue.length+ "): " + songNameQueue );
    
    } else {
        xc( "songName_queue: no songName!" );
    }
}


/*
 * apple.com + open.spotify.com
 */
if( globalActive
    //&& ( domain == "apple.com" || domain == "spotify.com" || domain == "ra.co" )
  ) {
    // runMusicSearchLinksColorWait()
    var userStringsArr;
    musicSeekHelper_check_arr_by_userpw( function(output) {
        userStringsArr = output;
    });
}


/*
 * on page load
 */
waitForKeyElements(".musicSeekHelper-action", runSearchLinksColorWait);
function runSearchLinksColorWait(jNode){
    // userStringsArr is global var
    
    var searchTargetId = jNode.attr("data-searchtargetid");

    // on load    
    var stringId = jNode.attr("data-stringid"),
        targetSite = jNode.attr("data-targetsite"),
        confirmTitle = jNode.attr("title");

    if( jNode.hasClass("musicSeekHelper-markChecked") ) {
        confirmTitle += ' (you\'ve already marked this song as checked or searched it on '+targetSite+')'; 
    }
    if( jNode.hasClass("musicSeekHelper-link") ) {
        confirmTitle += ' (you\'ve already searched this song or marked it as checked on '+targetSite+')'; 
    }
    
    if( userPw !== "" ) {
        var string = musicSeekHelper_getStringId( userPw, searchTargetId, stringId );
        //xc( string );

        if( jNode.attr("data-check-status") == "1" ) {
            actionLinkChecked( jNode, "1", confirmTitle );
        } else {
            if( musicSeekHelper_stringId_check_against_arr( string, userStringsArr ) === true ) {
                actionLinkChecked( jNode, "1", confirmTitle );
            }
        }
    }

    // on click
    jNode.click(function( e, confirmTitle ){
        // check if userPw is set
        xc( "musicSeekHelper-action click" );
        //xc( "userPw: " + userPw );
        if( userPw == "" ) {
            alert( 'You need to set your ID to save clicks.' );
            return false;
        }

        if( jNode.attr("data-check-status") != 1 ) {
            // cookie
            //xc( "about to musicSeekHelper_stringId_set(): " + stringId );
            musicSeekHelper_stringId_set( userPw, searchTargetId, stringId );
            
            actionLinkChecked( $(this), "1", confirmTitle ); // have it green now, unset if not saved by check_single
            // check if really saved (un-highlight icon if not), but give saving some time
            setTimeout(function() { 
                musicSeekHelper_stringId_check_single( userPw, searchTargetId, stringId, confirmTitle );
            }, 1500 );
        }
        
        // open link
        if( $(this).hasClass("musicSeekHelper-link") ) {
            e.stopPropagation();
            var url = $(this).attr("data-href"),
                target = "_self";
            // _self produces leave confirm popup when player is used

            if( $("#musicSeekHelper-option-openLinksInBrowser").prop('checked') ) { // var openLinksInBrowser only init
                url = $(this).attr("data-hrefbrowser");
                target = "_blank";
            }

            // _self produes "leave this page?" popup if player is playing
            if( domain == "apple.com" ) {
                target = "_blank";
            }

            var win = window.open( url, target );
            if (win) win.focus();
        }
    });
}


/*
 * on song play
 */
if( domain == "apple.com" ) {
    // grab the current playing song name from the player bar (if playing already)
    waitForKeyElements("#playback-name .web-chrome-playback-lcd__song-name-scroll-inner-text-wrapper", runAppleMusicTitleWait);
    function runAppleMusicTitleWait(jNode) {
        $("#playback-name").bind('DOMSubtreeModified', function() {
            // wait for #playback-sub-copy
            setTimeout(function() {
                var artistOrig = $("#playback-sub-copy > div > div > span > span > span:not(:last-of-type)").text().trim(),
                    titleOrig = $("#playback-name .web-chrome-playback-lcd__song-name-scroll-inner-text-wrapper").text().trim(),
                    songName = musicSeekHelper_NormalizeSongName( artistOrig+" - "+titleOrig ),
                    playingSongWrapper = $(".musicSeekHelper-wrapper[data-songname='"+songName+"']"),
                    optionMarkCheckedOnPlay = $("input#musicSeekHelper-option-markCheckedOnPlay").is(':checked'),
                    optionSearchOnPlay = $("input#musicSeekHelper-option-searchOnPlay").is(':checked');
                //xc( "song changed: " + songName );

                // add to queue (if browsing away)
                if( optionMarkCheckedOnPlay ) {
                    songName_queue( songName, "add" );
                }

                // click
                if( playingSongWrapper.length !== 0
                   && !playingSongWrapper.hasClass("onPlay-processed")
                  ) {
                    // markCheckedOnPlay
                    if( optionMarkCheckedOnPlay ) {
                        $(".musicSeekHelper-markChecked", jNode).click();
                    }

                    // searchOnPlay
                    if( optionSearchOnPlay ) {
                        $(".musicSeekHelper-link", jNode).click();
                    }

                    // mark wrapper as processed
                    playingSongWrapper.addClass("onPlay-processed");
                }
            }, 500);
        });
    }
    
    // After page the playback on first track is not registered, so check regulray
    $(function() {
        var toggle = true; // only once
        
        function updateF() {
            //xc( $(".songs-list-row:first.playing").length  );
            if( toggle && $(".songs-list-row:first.is-playing").length === 1 ) {
               // xc( $(".songs-list-row:first.playing").length  );
                // markCheckedOnPlay
                if( $("input#musicSeekHelper-option-markCheckedOnPlay").is(':checked') ) {
                    $(".songs-list-row:first.is-playing .musicSeekHelper-markChecked").click();
                }

                // searchOnPlay
                if( $("input#musicSeekHelper-option-searchOnPlay").is(':checked') ) {
                    $(".songs-list-row:first.is-playing .musicSeekHelper-link.td").click();
                }
                toggle = false;
            }
        }
        setInterval(updateF, 800);
    });
    
    // grab the current playing song name from the list by class name
    waitForKeyElements(".songs-list-row.is-playing", runSongPlayAppleMusicWait);
    function runSongPlayAppleMusicWait(jNode){
        // markCheckedOnPlay
        if( $("input#musicSeekHelper-option-markCheckedOnPlay").is(':checked') ) {
            $(".musicSeekHelper-markChecked", jNode).click();
        }

        // searchOnPlay
        if( $("input#musicSeekHelper-option-searchOnPlay").is(':checked') ) {
            $(".musicSeekHelper-link", jNode).click();
        }
    }
}
if( domain == "spotify.com" ) {
    // grab the current playing song name from the title tag
    waitForKeyElements(".musicSeekHelper-wrapper", runSpotifyTitleWait);
    function runSpotifyTitleWait(jNode) {
        $("head title").bind('DOMSubtreeModified', function() {
            if( titleText != $("head title").text() ) {
                
                var titleText = $("head title").text();
                //xc( "title changed: " + titleText );
                //xc( "regex check: " + / · /.test(titleText) );
                
                if( / · /.test(titleText) ) {
                    var artistOrig = titleText.replace(/(.+) · (.+)/, "$2"),
                        titleOrig = titleText.replace(/(.+) · (.+)/, "$1"),
                        songName = musicSeekHelper_NormalizeSongName( artistOrig+" - "+titleOrig ),
                        playingSongWrapper = $(".musicSeekHelper-wrapper[data-songname='"+songName+"']"),
                        optionMarkCheckedOnPlay = $("input#musicSeekHelper-option-markCheckedOnPlay").is(':checked'),
                        optionSearchOnPlay = $("input#musicSeekHelper-option-searchOnPlay").is(':checked');
                    
                    //xc( optionMarkCheckedOnPlay );
                    xc( songName );
                    //xc( "optionMarkCheckedOnPlay: " + optionMarkCheckedOnPlay );
                    
                    // add to queue (if browsing away)
                    if( optionMarkCheckedOnPlay ) {
                        songName_queue( songName, "add" );
                    }
                    
                    // click
                    if( playingSongWrapper.length !== 0
                        && !playingSongWrapper.hasClass("onPlay-processed")
                      ) {
                        //xc( songName );

                        // markCheckedOnPlay
                        if( optionMarkCheckedOnPlay ) {
                            $(".musicSeekHelper-markChecked", playingSongWrapper).click();
                        }

                        // searchOnPlay
                        if( optionSearchOnPlay ) {
                            $(".musicSeekHelper-link", playingSongWrapper).click();
                        }
                        
                        // mark wrapper as processed
                        playingSongWrapper.addClass("onPlay-processed");
                        $(".musicSeekHelper-nowPlaying").removeClass("musicSeekHelper-nowPlaying");
                        playingSongWrapper.closest("div[role='row']").addClass("musicSeekHelper-nowPlaying");
                    }
                }
            }
        });
    }
    
    // grab the current playing song name by green color in song list
    $(function() {
        function update() {
            $("div[data-testid='tracklist-row'] a[data-testid='internal-track-link']").each(function(){
                //xc( $(this).css('color') +" = "+hexToRgb('#1db954')  );
                if( $(this).css('color') === hexToRgb('#1db954') 
                    || $(this).css('color') === hexToRgb('#1ed760') // focus
                  ) {
                    $(".musicSeekHelper-nowPlaying").removeClass("musicSeekHelper-nowPlaying");
                    $(this).closest("div[data-testid='tracklist-row']").prev(".musicSeekHelper-wrapper").addClass("musicSeekHelper-nowPlaying");
                }
            });
        
            // markCheckedOnPlay
            if( $("input#musicSeekHelper-option-markCheckedOnPlay").is(':checked') ) {
                $(".musicSeekHelper-nowPlaying .musicSeekHelper-markChecked").click();
            }

            // searchOnPlay
            if( $("input#musicSeekHelper-option-searchOnPlay").is(':checked') ) {
                $(".musicSeekHelper-nowPlaying .musicSeekHelper-link.td").click();
            }
        }
        
        setInterval(update, 2000);
        update();
    });
    
    // 
    /*
    waitForKeyElements(".musicSeekHelper-nowPlaying", runSongPlaySpotifyWait);
    function runSongPlaySpotifyWait(jNode){
        xc( "runSongPlaySpotifyWait()" );
        
        // markCheckedOnPlay
        if( $("input#musicSeekHelper-option-markCheckedOnPlay").is(':checked') ) {
            $(".musicSeekHelper-nowPlaying .musicSeekHelper-markChecked").click();
        }
        
        // searchOnPlay
        if( $("input#musicSeekHelper-option-searchOnPlay").is(':checked') ) {
            $(".musicSeekHelper-link.sp", jNode).click();
        }
    }
    */
}


/*
 * dialogArea
 */
var dialogArea = '<div id="musicSeekHelper-dialogArea" class="'+onDomain+'">';

// h3
dialogArea += '<h3 id="musicSeekHelper-dialogArea-title" class="mixesDBorange hand" title="Click to toggle"><span>Music Seek Helper</span>';
if( Cookies.get( optActive ) == "true" || Cookies.get( optActive ) == null ) {
    var checked = 'checked="checked"';
    var title = "Check to activate";
} else {
    var checked = '';
    var title = "Uncheck to activate";
}
dialogArea += '<input type="checkbox" id="'+optActive+'" name="'+optActive+'" '+checked+' title="'+title+'">';
dialogArea += '</h3>';

// toggle section
dialogArea += '<section id="musicSeekHelper-dialogArea-toggle" style="display:none">';

// options
if( Cookies.get( optActive ) == "true" ) {
    //userPwSecured = "su******"; /* for screenshots */
    
    dialogArea += '<div class="musicSeekHelper-dialogArea-section">';
    dialogArea += '<p><strong>Your ID:</strong><button id="userPwForm-change" style="display:none">change</button></p>';
    dialogArea += '<form name="userPwForm" id="userPwForm">';
    dialogArea += '<input id="userPwForm-input" type="text" pattern="[A-Za-z0-9]{3,25}" placeholder="Allowed (max. 25): A-z 0-9" maxlength="25" value="'+userPwSecured+'" required="required" />';
    dialogArea += '<div id="userPwForm-change-help" style="display:none">With a new ID you start from scratch. All previously saved searches will remain under the old ID.</div>';
    dialogArea += '<div id="userPwForm-input-help" style="display:none">Set a unique ID to identify you across sites. Do not use a real password of yours!</div>';
    dialogArea += '<input id="userPwForm-submit" type="submit" value="Save" style="display:none">';
    dialogArea += '</form>';
    dialogArea += '</div>';

    dialogArea += '<div id="dialogArea-actionButtons" class="'+onDomain+'">';
    dialogArea += '<button id="actionButtons-hideFavedCheckedSearched" style="display:none" title="The playback queue cannot be cleared. The currently playing song stays visible for convenience.">Hide faved, checked and searched songs</button>';
    dialogArea += '</div>';
    
    dialogArea += '<div id="dialogArea-addonWarning" class="musicSeekHelper-dialogArea-section" style="display:none">';
    dialogArea += '<p><strong>Browser addons:</strong></p>';
    dialogArea += 'You need to enable browser addons to get '+thisSitename+'\'s Content Security Policy directive. Install the Chrome addon:';
    dialogArea += '<ul>';
        dialogArea += '<li><span class="mdb-fake-link" data-href="https://chrome.google.com/webstore/detail/always-disable-content-se/ffelghdomoehpceihalcnbmnodohkibj/related" target="_blank">Always Disable Content-Security-Policy</span>';
            dialogArea += ' or <span class="mdb-fake-link" data-href="https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden/related" target="_blank">Disable Content-Security-Policy</span>';
        dialogArea += '</li>';
        //dialogArea += '<li><span class="mdb-fake-link" data-href="https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino/related">CORS Unblock</span></li>';
    dialogArea += '</ul>';
    dialogArea += '</div>';
    dialogArea += '<div id="dialogArea-options" class="musicSeekHelper-dialogArea-section">';
    dialogArea += '<p><strong>Options:</strong></p>';
    dialogArea += '<ul>';
    options = { "markCheckedOnPlay": { "id": "musicSeekHelper-option-markCheckedOnPlay",
                                       "label": 'Playing a song marks it as checked.',
                                       "title": 'You can leave the page and browse around.'
                                     },
                "searchOnPlay": { "id": "musicSeekHelper-option-searchOnPlay",
                                  "label": "Playing a song opens the "+searchTargetName+" search.",
                                  "title": "You must stay on the page and have pop-ups allowed for "+domain+".",
                                  "tip": "Mute the audio and use keyboard media keys to open one search after the other."
                                },
                "openLinksInBrowser": { "id": "musicSeekHelper-option-openLinksInBrowser",
                                        "label": 'Open search links in the browser.',
                                        "title": 'Apple Music links cannot be opened in the app due to a current bug.'
                                       }
    }
    
    $.each(options, function( i, value ) {
        var checked = ( Cookies.get( value.id ) == "true" ) ? 'checked="checked"' : '';
        dialogArea += '<li id="'+value.id+'-wrapper"><input type="checkbox" id="'+value.id+'" name="'+value.id+'" '+checked+'><label for="'+value.id+'"><span title="'+value.title+'">'+value.label+'</span>';
        if( value.tip ) {
            dialogArea += ' <abbr class="tip" title="'+value.tip+'">Tip</abbr>';
        }
        dialogArea += '</label></li>';
    });
    dialogArea += '</ul>';
    
    // end
    dialogArea += '</section>';
    dialogArea += '</div>';
}

dialogArea += '</div>';

// toggle dialogArea
waitForKeyElements("#musicSeekHelper-dialogArea-title", toggleDialogAreaWait);
function toggleDialogAreaWait(jNode){
    // hide if cookie
    if( Cookies.get( "musicSeekHelper-dialogArea-hide" ) != "true" ) {
        $("#musicSeekHelper-dialogArea-toggle").show();
    }
    
    // on title click
    $("span", jNode).click(function(){
        // cookie
        if( $("#musicSeekHelper-dialogArea-toggle").is(':visible') ) {
            Cookies.set( "musicSeekHelper-dialogArea-hide", "true", { expires: 365, domain: domain } );
        } else {
            Cookies.set( "musicSeekHelper-dialogArea-hide", "false", { expires: 365, domain: domain } );
        }
                
        // toggle
        $("#musicSeekHelper-dialogArea-toggle").slideToggle();
    });
}


/*
 * dialogArea
 */
var waitForKeyElementsDelay = 5000;

if( domain == "apple.com" ) {
    // append dialogArea
    waitForKeyElements(".navigation__native-cta", runAppleMusicDialogAreaWait);
    function runAppleMusicDialogAreaWait( jNode ) {
        jNode.after( dialogArea );
    }
}
if( domain == "spotify.com" ) {
    // append dialogArea
    waitForKeyElements("div[data-testid='rootlist-container']", runSpotifyDialogAreaWait);
    function runSpotifyDialogAreaWait( jNode ) {
        jNode.after( dialogArea );
        $("#musicSeekHelper-option-openLinksInBrowser").attr("checked","checked").attr("disabled","disabled");
    }
}
if( domain == "ra.co" ) {
    // append dialogArea
    waitForKeyElements("div[data-tracking-id='music-home']", runRaDialogAreaWait); // ra.co/music + ra.co/reviews
    waitForKeyElements("nav[data-tracking-id='reviews-sub-nav'] + div", runRaDialogAreaWait); // ra.co/reviews/recommends
    waitForKeyElements("section[data-tracking-id='review-detail']", runRaDialogAreaWait); // detail page
    function runRaDialogAreaWait( jNode ) {
        jNode.prepend( dialogArea );
    }
}
    
// dialogArea action
waitForKeyElements("#musicSeekHelper-dialogArea", runDialogAreaWait);
function runDialogAreaWait(jNode) {
    // deactivate userscript if checkbox is unchecked
    $("#"+optActive).on("change",function(){
        var val = $(this).prop('checked'); // "true" or "false"
        Cookies.set( optActive, val, { expires: 365, domain: domain } );
        location.reload();
    });

    if( userPw == "" ) {
        $("#userPwForm-submit").show();
        $("#userPwForm-input-help").show();
        var input = $("#userPwForm-input");
    } else {
        $("#userPwForm-input").attr("disabled","disabled");
    }
    
    var userPwForm = $("form#userPwForm");

    function userPwFormSet() {
        if( userPw == "" ) {
            if( $("#userPwForm-submit").length === 0 ) userPwForm.append('<input id="userPwForm-submit" type="submit" value="Set">');
        } else {
            $("#userPwForm-input",userPwForm).attr("disabled","disabled");
            $("#userPwForm-change").show();
        }
    }
    userPwFormSet();

    userPwForm.on("submit", function(){
        var userPw = $("#userPwForm-input").val();
        if( userPw != "" ) Cookies.set( "musicSeekHelper-userId", userPw, { expires: 365, domain: domain } );
        //userPwFormSet();
    });

    $("#userPwForm-change").click(function(){
        $("#userPwForm-change").hide();
        $("#userPwForm-input-help").show().append( '<br />' + $("#userPwForm-input").attr("placeholder") );
        $("#userPwForm-change-help").show();
        $("#userPwForm-submit").show();
        var input = $("#userPwForm-input");
        input.removeAttr("disabled");
        input.focus();
        input.select();
    });

    if( globalActive ) {
        apiResponseCheck();
    }
    triggerFakeLinks();
    onOptionsChange();
}


/* 
 * Global active or not
 */
//xc( "globalActive: " + globalActive );
if( !globalActive ) {
    return false;
}


/*
 * 
 * apple.com
 * 
 */
// runAppleMusic()
function runAppleMusic( type="playlist" ){
    var c = $(".songs-list"),
        li = $(".songs-list-row",c);

    // iterate through list
    delay = 0;
    li.each(function() {
        var li = $(this);
        setTimeout(function() { // avoid event overflow
            if( $(".musicSeekHelper-link", li).length === 1 ) {
                return false;
            }

            var artistRow = $(".songs-list-row__by-line", li); // playlist artist
            //xc( "artistRow before check: " + artistRow.text().trim() );
            
            if( artistRow.length === 0 || artistRow.text() == "" ) {
                artistRow = $(".album-header-metadata .product-creator"); // album artist
            }

            var artistOrig = artistRow.text().trim(),
                titleOrig = $(".songs-list-row__song-name", li).text().trim(),
                artist = artistOrig.replace(/\s+/g, " "),
                title = titleOrig
                        .replace(/ \(feat.+\) [\[(](.+mix)[)\]]/gi, " ($1)")
                        .replace(/(.+) \(feat.+\)$/gi, "$1")
                        .replace(/F\*\*k/gi,"Fuck")
                        .replace(/S\*\*t/gi,"Shit"),
                dataSongName = 'data-songname="'+musicSeekHelper_NormalizeSongName(artistOrig+' - '+titleOrig)+'"',
                target = $(".songs-list-row__add-to-library", li);
            
            if( artist == "" ) {
                var headings = $(".container-detail-header .headings"),
                    artist = $(".headings__subtitles", headings).text().trim();
            }
            
            //xc( "list: "+ artist +' '+ title );
            
            if( target.length == 0 ) {
                $(".songs-list-row__controls", li).prepend( '<div class="songs-list-row__add-to-library fake"></div>' );
                target = $(".songs-list-row__add-to-library", li);
            }

            // append icons
            var markCheckedIcon = makeIcon( "markChecked", "Apple Music", artist, title, "", 16 ),
                spotifyLink = makeIcon( "searchLink", "Spotify", artist, title, "playlist", 18 ),
                tidalLink = makeIcon( "searchLink", "TIDAL", artist, title, "playlist", 18 );
            
            if( $(".musicSeekHelper-wrapper", target).length === 0 ) {
                var html = '<div class="musicSeekHelper-wrapper playlist '+onDomain+'" '+dataSongName+'>';
                    html += '<div class="musicSeekHelper-markChecked-wrapper">'+markCheckedIcon+'</div>';
                    html += '<div class="musicSeekHelper-link-wrapper">'+spotifyLink+'</div>';
                    html += '<div class="musicSeekHelper-link-wrapper">'+tidalLink+'</div>';
                html += '</div>';
                target.append( html );
            }
        }, delay );
        delay += 5;
    });
    
    // album header
    if( type == "album" && $(".musicSeekHelper-wrapper.album").length === 0 ) {
        var headings = $(".container-detail-header .headings"),
            artist = $(".headings__subtitles", headings).text().trim(),
            title = $(".headings__title", headings).text()
                     .replace(/(.+) - (EP|Single)$/gi,"$1")
                     .trim(),
            markCheckedIcon = makeIcon( "markChecked", "Apple Music", artist, title, "album", 24 ),
            spotifyLink = makeIcon( "searchLink", "Spotify", artist, title, "album", 26 ),
            tidalLink = makeIcon( "searchLink", "TIDAL", artist, title, "album", 26 );
        //xc( "album: "+ artist + " " + title );
        
        var html = '<div class="musicSeekHelper-wrapper album '+onDomain+'">';
        html += '<div class="musicSeekHelper-markChecked-wrapper">'+markCheckedIcon+'</div>';
        html += '<div class="musicSeekHelper-link-wrapper">'+spotifyLink+'</div>';
        html += '<div class="musicSeekHelper-link-wrapper">'+tidalLink+'</div>';
        html += '</div>';

        headings.append( html );
    }
    
    // artist profile name
    $("h1.artist-header__name").each(function(){
        if( $(".musicSeekHelper-action",this).length === 0 ) {
            var text = $(this).text().trim(),
                markCheckedIcon = makeIcon( "markChecked", "Apple Music", "", text, "album", 30 ),
                spotifyLink = makeIcon( "searchLink", "Spotify", "", text, "album", 36, "artists" ),
                tidalLink = makeIcon( "searchLink", "TIDAL", "", text, "album", 36, "artists" );

            $(this).append( markCheckedIcon + spotifyLink + tidalLink );
        }
    });
    
    // toggle playlist description
    waitForKeyElements(".product-page-header__metadata .truncated-content-container", runTruncDescWait);
    function runTruncDescWait(jNode){
        var truncWrapper = jNode,
            truncText = $("p", truncWrapper);
        truncWrapper.html( truncText );
    }
}

if( domain == "apple.com" ) {
    // Run funcs
    xc( urlPath(2) );
    
    // playlist
    if( urlPath(2) == "playlist" ) {
        waitForKeyElements(".songs-list-row[data-row=0]", runAppleMusicPlaylistWait);
        function runAppleMusicPlaylistWait(jNode) {
            setTimeout( function() {
                runAppleMusic();
            }, waitForKeyElementsDelay);
        }

        // 100+ (max 6000) songs in a playlist
        for (var n = 1; n < 61; ++ n) {
            //xc( ".songs-list-row[data-row="+n+"00]" );
            waitForKeyElements(".songs-list-row[data-row="+n+"00]", runAppleMusic);
        }
    }
    
    // album
    if( urlPath(2) == "album" ) {
        waitForKeyElements(".product-page h1#page-container__first-linked-element", runAppleMusicAlbumWait);
        function runAppleMusicAlbumWait(jNode) {
            setTimeout( function() {
                runAppleMusic( "album" );
            }, waitForKeyElementsDelay );
        }
    }
    
    // prevent double clicks on title block (which starts the player)
    /*
    document.addEventListener( 'dblclick', function(event) {
        event.preventDefault();  
        event.stopPropagation(); 
    },  true //capturing phase!
    );
    */
}


/*
 * 
 * open.spotify.com
 * 
 */
// runSpotify()
function runSpotify(){
    //xc( type );
    var li = $("div[data-testid='tracklist-row']:not(.processed)");

    li.each(function(){
        // remove unneeded spans (Explicit label)
        $("span > span", this).each(function(){
            if( $(this).text() == "E" && $(this).attr("aria-label") !== "" ) {
                $(this).remove();
            }
        });

        var artistTitleWrapper = $("div[aria-colindex='2'] div:first-of-type", this);
        
        // on search page col 1 is not the nubered list
        if( urlPath(1) == "search" && typeof( urlPath(3) ) === "undefined" ) {
            artistTitleWrapper = $("div:nth-of-type(2)", this);
        }
        
        var artistOrig = $("span", artistTitleWrapper).text().trim(),
            titleOrig = $("div:first-of-type", artistTitleWrapper).text().trim();
        
        // on artist page top lists the artist is missing
        if( urlPath(1) == "artist" ) {
            artistOrig = $("section[data-testid='artist-page'] span h1").text().trim();
        }
            
        var dataSongName = 'data-songname="'+musicSeekHelper_NormalizeSongName(artistOrig+' - '+titleOrig)+'"',
            artist = artistOrig
                        .replace(", ", " "),
            title = titleOrig
                        .replace(/ - (Mixed)$/g, "")
                        .replace(/[',]/g, "");

        //xc( "before makeIcon: " + artist + " " + title );

        var markCheckedIcon = makeIcon( "markChecked", "Spotify", artist, title, "", 18 ),
            appleMusicLink = makeIcon( "searchLink", "Apple Music", artist, title, "", 20 ),
            tidalLink = makeIcon( "searchLink", "TIDAL", artist, title, "", 20 );

        if( $(this).prev(".musicSeekHelper-wrapper").length === 0 ) {
            var html = '<div class="musicSeekHelper-wrapper playlist '+onDomain+'" '+dataSongName+'>';
                    html += '<div class="musicSeekHelper-markChecked-wrapper">'+markCheckedIcon+'</div>';
                    html += '<div class="musicSeekHelper-link-wrapper am">'+appleMusicLink+'</div>';
                    html += '<div class="musicSeekHelper-link-wrapper td">'+tidalLink+'</div>';
                html += '</div>';
            $(this).before( html );
        }

        $(this).addClass("processed");
    });
    
    // album only
    if( $(".musicSeekHelper-wrapper.album").length === 0 ) {
        var h1 = $(".main-view-container h1"),
            artistWrapper = h1.closest("span").next("div"),
            artist = $("div a", artistWrapper).text(),
            title = h1.text();
        //xc( "Album: " + artist + " " + title );
        
        if( urlPath(1) == "artist" ) {
            artist = $("section[data-testid='artist-page'] span h1").text().trim();
            title = "";
        }

        var markCheckedIcon = makeIcon( "markChecked", "Spotify", artist, title, "album", 28 ),
            appleMusicLink = makeIcon( "searchLink", "Apple Music", artist, title, "album", 32 ),
            tidalLink = makeIcon( "searchLink", "TIDAL", artist, title, "album", 32, "albums" );
        
        var html = '<div class="musicSeekHelper-wrapper album '+onDomain+'">';
            html += '<div class="musicSeekHelper-markChecked-wrapper">'+markCheckedIcon+'</div>';
            html += '<div class="musicSeekHelper-link-wrapper am">'+appleMusicLink+'</div>';
            html += '<div class="musicSeekHelper-link-wrapper td">'+tidalLink+'</div>';
        html += '</div>';

        h1.after( html );
    }
}

if( domain == "spotify.com" ) {
    // album
    if( urlPath(1) == "album" ) {
        waitForKeyElements(".main-view-container h1", runSpotifyAlbumWait);
        function runSpotifyAlbumWait(jNode) {
            runSpotify();
        }
    }
    
    // playlist
    if( urlPath(1) == "playlist" || urlPath(1) == "search" || urlPath(1) == "album"  || urlPath(1) == "artist" ) {
    waitForKeyElements("div[data-testid='playlist-tracklist']", runSpotifyPlaylistWait);
        function runSpotifyPlaylistWait(jNode) {
            runSpotify();
        }
    }
}


/*
 * 
 * ra.co
 *
 */
function artistTrackRa( text ) {
    var artist = text.replace(/(.+) - (.+)/, "$1")
                     .replace(/^Rewind: /,"")
                     .replace(/[/]/g, ""),
        title = text.replace(/(.+) - (.+)/, "$2")
                    .replace(/[/]/g," ")
        ;
    return [artist, title]; 
}

if( domain == "ra.co" ) {
    // teaser
    waitForKeyElements("h3 a span", runResidentAdvisorH3Wait);
    function runResidentAdvisorH3Wait(jNode) {
        var text = jNode.text();
        //xc( "H3: " + text );
        
        var artist = artistTrackRa(text)[0],
            title = artistTrackRa(text)[1];
        
        if( artist && title ) {
            var spotifyLink = makeIcon( "searchLink", "Spotify", artist, title, "musicSeekHelper-link-ra", 24 ),
                appleMusicLink = makeIcon( "searchLink", "Apple Music", artist, title, "musicSeekHelper-link-ra", 24 ),
                tidalLink = makeIcon( "searchLink", "TIDAL", artist, title, "musicSeekHelper-link-td", 24 );
            jNode.closest("a").after( '<span class="nobr">&nbsp;&nbsp;' + spotifyLink +'&nbsp;'+ appleMusicLink +'&nbsp;'+ tidalLink +'</span>'); // do not break to next line with padding left
        }
    }
    
    // detail page
    // DRY
    waitForKeyElements('section[data-tracking-id="review-detail-bar"]', runResidentAdvisorH1Wait);
    function runResidentAdvisorH1Wait(jNode) {
        var heading = jNode.prev("header").find("h1 span"),
            text = heading.text();
        //xc( "H1: " + text );
        
        var artist = artistTrackRa(text)[0].replace(/^Various$/g,""),
            title = artistTrackRa(text)[1];
        
        if( title ) {
            if( artist == title ) artist = "";
            var spotifyLink = makeIcon( "searchLink", "Spotify", artist, title, "musicSeekHelper-link-ra", 48 ),
                appleMusicLink = makeIcon( "searchLink", "Apple Music", artist, title, "musicSeekHelper-link-ra", 46 ),
                tidalLink = makeIcon( "searchLink", "TIDAL", artist, title, "musicSeekHelper-link-td", 46 );
            heading.append('<span class="nobr" style="margin-left:20px;">' + spotifyLink +'&nbsp;'+ appleMusicLink +'&nbsp;'+ tidalLink + '</span>' );
        }
        
        $("#musicSeekHelper-dialogArea").addClass("detailPage");
    }
}


/*
 * action buttons
 */
waitForKeyElements("#dialogArea-actionButtons #actionButtons-hideFavedCheckedSearched", runhideFavedCheckedSearchedWait);
function runhideFavedCheckedSearchedWait(jNode) {
    var button = $("#actionButtons-hideFavedCheckedSearched"),
        buttonHtml = button.outerHTML();
    
    // move
    switch( domain ) {
        case "apple.com":
            var songsList = $(".product-info .songs-list");
            if( songsList.length > 0 && $("#actionButtons-outsideDialogArea #actionButtons-hideFavedCheckedSearched").length === 0 ) {
                songsList.after( '<div id="actionButtons-outsideDialogArea" class="'+onDomain+'">'+ buttonHtml +'</div>' );
                $("#actionButtons-outsideDialogArea #actionButtons-hideFavedCheckedSearched").fadeIn(animationDur);
            }
            
            break;

        case "spotify.com":
            if( $("#actionButtons-outsideDialogArea #actionButtons-hideFavedCheckedSearched").length === 0 ) {
                waitForKeyElements("div[data-testid='playlist-tracklist']", runPlaylistTracklistWait);
                function runPlaylistTracklistWait(jNode) {
                    $("div[data-testid='action-bar-row']").append('<div id="actionButtons-outsideDialogArea" class="'+onDomain+'">'+ buttonHtml +'</div>');
                    $("#actionButtons-outsideDialogArea #actionButtons-hideFavedCheckedSearched").fadeIn(animationDur);
                }
            }
            
            break;
    }
    
    // click
    button = $("#actionButtons-outsideDialogArea #actionButtons-hideFavedCheckedSearched");
    button.click(function() {
        var checkedItem = $(".musicSeekHelper-action[data-check-status='1']");
        
        // on click
        switch( domain ) {
            case "apple.com":
                checkedItem.closest(".songs-list-row:not(.songs-list-row--playing)").hide(); /* animation is ugly */
                
                var favedItem = $(".songs-list-row .love-or-popular__loved");
                favedItem.each(function() {
                    $(this).closest(".songs-list-row:not(.songs-list-row--playing)").hide();
                });
                
                // scroll to top
                $(".loading-inner").attr("id","top");
                document.location.href = "#top";
                
                break;
                
            case "spotify.com":
                checkedItem.closest("div[role='row']:not(.musicSeekHelper-nowPlaying)").slideUp(animationDur);
                
                /* grab fav icon solor
                $("div[data-testid='tracklist-row'] button[data-testid='add-button'] svg").each(function() {
                    console.log( $(this).css("color") );
                });
                */
                var favedItem = $("div[data-testid='tracklist-row'] button[data-testid='add-button'] svg");
                favedItem.each(function() {
                    //xc( $(this).css('color') );
                    if( $(this).css('color') == "rgb(29, 185, 84)" ) {
                        $(this).closest("div[role='row']:not(.musicSeekHelper-nowPlaying)").slideUp(animationDur);
                    }
                });
                
                // fix height
                var topSentinal = $("div[data-testid='top-sentinel']"),
                    height = topSentinal.next("div").innerHeight();
                //topSentinal.parent("div").css("height",height+"px");
                
                break;
        }
        
        // animate feedback
        button.animate({
            opacity: 0.25
        }, 10, function() {
            button.animate({
                opacity: 1
            }, 50, function() {});
        });
    });
}


/*
 * 
 * Repeat site-wide check (on navigating around)
 *
 */
// repeat
if( domain == "spotify.com" || domain == "apple.com" ) { 
    var current_href = location.href;
    setInterval(function(){
        //xc( "update()" );
        runSpotify( "all" );
        runAppleMusic( "" );
        runAppleMusic( "album" );
        songName_queue_Do();
        //xc( "songNameQueue ("+songNameQueue.length+"): "+songNameQueue );
        runhideFavedCheckedSearchedWait();
    }, 5000);

    setInterval(function(){
        // on url change
        if( current_href !== location.href ) {
            xc( "url change" );
            songName_queue_Do();
            runhideFavedCheckedSearchedWait();
            current_href = location.href;
        }
    }, 2000);
}