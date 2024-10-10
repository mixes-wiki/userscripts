// ==UserScript==
// @name         TrackId.net (by Mixes.wiki)
// @author       User:Martin@Mixes.wiki (Subfader@GitHub)
// @version      2024.10.10.2-alpha
// @description  Change the look and behaviour of certain DJ culture related websites to help contributing to Mixes.wiki, e.g. add copy-paste ready tracklists in wiki syntax.
// @homepageURL  https://www.mixes.wiki/w/Help:Mixes.wiki_userscripts
// @supportURL   https://discord.com/channels/1258107262833262603/1261652394799005858
// @updateURL    https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/TrackId.net/script.user.js
// @downloadRL   https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/TrackId.net/script.user.js
// @require      https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/includes/jquery-3.7.1.min.js
// @require      https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/includes/waitForKeyElements.js
// @require      https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/includes/youtube_funcs.js
// @require      https://raw.githubusercontent.com/Subfader/userscripts/refs/heads/main/includes/global.js?v-TrackId.net_16
// @resource     IMPORTED_CSS https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/includes/global.css?v-TrackId.net_12
// @resource     IMPORTED_CSS https://raw.githubusercontent.com/mixes-wiki/userscripts/refs/heads/main/TrackId.net/script.css
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
 * grab url path and fire functions
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


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Funcs
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// searchOnMixesDB
function searchOnMixesDB(text, target, size) {
    logFunc( "searchOnMixesDB" );

    if (text !== "") {
        logVar( "text", text );

        // id + class
        var className = idName = "";
        switch (target) {
            case "detail page":
                var idName = "mdbSearchLink-detailPage";
                break;
            case "list":
                var className = "mdbSearchLink-list";
                break;
        }

        var textOut = trackidNet_FixTitle(text),
            url = 'https://www.mixes.wiki/w/index.php?title=&search=' + encodeURIComponent(textOut),
            linkTitle = 'Search &quot;' + text + '&quot; on MixesDB',
            searchLink = '<a id="' + idName + '" class="' + className + '" href="' + url + '" title="' + linkTitle + '" target="_blank"><img width="' + size + '" src="' + mdbLogoUrl64 + '" alt="' + linkTitle + '"/></a>';

        return searchLink;

    } else {
        log( "No text from from previous function!" );
    }
}

// trackidNet_FixTitle
function trackidNet_FixTitle(text) {
    logFunc( "trackidNet_FixTitle" );

    if (text) {
        logVar( "text", text );
        var textOut = text.replace(/[|-]/g, " ")
            .replace(/(#|\[|]|\(|\)|\.|\*| I )/g, " ")
            .replace(/ (Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)( |-|$)/g, " ")
            .replace(/\s+/g, " ")
            .replace(/(\/)/g, " ")
            .replace(/ (on) /g, " ")
            .replace(/RA (\d)/g, "RA.$1")
            .trim();
        return textOut;
    } else {
        log( "No text from from previous function!" );
    }
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Tables
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// funcTrackidNetTables
// fix ugly grid layout to proper tables
function funcTrackidNetTables(jNode) {
    logFunc( "funcTrackidNetTables" );
    $("#mdb-trackidnet-table").remove();

    var audiostreams = [],
        heading = $(".MuiGrid-grid-xs-12 p.MuiTypography-body1"),
        grid = $(".data-grid", jNode).add(".MuiDataGrid-root"),
        addPlay = true,
        addCheck = true;

    if (grid.length == 1 && grid.is(":visible")) {
        var tableClass = heading.text().replace(/ /g, ""),
            path = location.pathname.replace(/^\//, "");
        grid.before('<table id="mdb-trackidnet-table" class="' + tableClass + ' ' + path + '"><tbody></tbody></table>');
        var tbody = $("#mdb-trackidnet-table tbody");

        $(".MuiDataGrid-columnHeader", grid).each(function () {
            var text = $(this).text().replace(/ /g, ""),
                textId = $(this).attr("data-field");
            if (textId == "#") textId = "Index";
            if (textId) tbody.append('<th id="' + textId + '">' + text + '</th>');
        });

        if (urlPath(1) == "myrequests") {
            addPlay = false;
        }

        if (urlPath(1) == "audiostreams") {
            addCheck = false;
        }

        if (addCheck) {
            tbody.append('<th id="mixesdbPageCheck">MixesDB<br />check</th>');
        }

        $(".MuiDataGrid-row").each(function () {
            log("get urls" + $(this).html());
            var rowId = $(this).attr("data-id"),
                listItemLink = $(".MuiDataGrid-cell--textLeft[data-colindex=2] a.white-link", this);

            if (typeof listItemLink.attr("href") !== "undefined") {
                var listItemText = listItemLink.text(),
                    rowUrl = listItemLink.attr("href").replace(/^\//, ""),
                    urlSplit = rowUrl.split("/"),
                    urlType = urlSplit[0].replace(/s$/, ""), // musictrack or audiostream
                    urlValue = urlSplit[1];
            }

            if (urlValue) {
                switch (urlType) {
                    case "audiostream":
                        audiostreams.push(urlValue);
                        break;
                }
            }

            log("table addPlay: " + addPlay);
            log("table addCheck: " + addCheck);

            // each gridd cell
            tbody.append('<tr id="' + rowId + '" data-' + urlType + '="' + urlValue + '"></tr>');
            var thisTr = $("tr#" + rowId + "");

            $(".MuiDataGrid-cell", this).each(function () {
                var cellClass = $(this).attr("data-field"),
                    cellContent = $(this).html(),
                    contOutput = true;

                if (cellClass == "play") {
                    if (addPlay) {
                        var playWrapper = $(this).closest('div.MuiDataGrid-row');
                        //cellContent = playWrapper.html();
                        cellContent = $(this).html();
                    } else {
                        // no play row
                        contOutput = false;
                    }
                }

                if (contOutput && cellContent) thisTr.append('<td class="' + cellClass + '">' + cellContent + '</td>');
            });

            // MixesDB page check
            if (typeof listItemText !== "undefined") {
                logVar("listItemText", listItemText);

                var mixTitle = listItemText,
                    checkAction = "–",
                    searchLink = searchOnMixesDB(mixTitle, "list", 26);
                if (searchLink) checkAction = searchLink;

                if (addCheck) {
                    thisTr.append('<td class="mixesdbPageCheck-status center"><span class="mixesdbPageCheck-status-no hidden">' + checkAction + '</span></td>');
                }
            } else {
                log( "No listItemText!" );
            }
        });

        // hide grid but keep page navigation
        $(".MuiTablePagination-toolbar").insertAfter($("#mdb-trackidnet-table"));

        // on audio pages hide the play button doesn't work in the copied tracklist table
        // but it is needed to generate the formatted tracklist textarea
        // so we hide the table and add the youtube search icon to the existing grid.
        if (urlPath(1) == "audiostreams") {
            $("#mdb-trackidnet-table").fadeOut(300); // needs to be visible shortly for tracklist textarea generation
            grid.show();

            // add youtube search icon to grid
        } else {
            grid.addClass('mdb-hide');
        }

        // remove empty th
        //if( !addPlay ) $("#mdb-trackidnet-table tbody th:first-of-type").remove();
    }

    log("audiostreams: " + audiostreams);
    log("> length: " + audiostreams.length);
    if (audiostreams.length > 0) {
        log("about to run trackidnet_checked_check_batch");

        var list = audiostreams.join(", "),
            res = trackidnet_checked("trackidnet_checked_check_batch", list);
        if (res !== null) {
            $.each(res, function () {
                var audiostream = $(this)[0].audiostream,
                    timestamp = $(this)[0].timestamp;
                log(audiostream);

                $("tr[data-audiostream='" + audiostream + "'] td.mixesdbPageCheck-status").html(checkIcon);
            });
            $(".mixesdbPageCheck-status-no").show();
        }
    }
}

// waitForKeyElements tables
waitForKeyElements(".MuiDataGrid-virtualScrollerRenderZone:not(.processed)", waitTables);
function waitTables(jNode) {
    jNode.addClass("processed");
    setTimeout(function () {
        funcTrackidNetTables(jNode.closest(".MuiDataGrid-main"));
    }, timeoutDelay);
}
$(".MuiDataGrid-virtualScrollerRenderZone .MuiDataGrid-cell:not(.processed)").on("change", function () {
    jNode.addClass("processed");
    setTimeout(function () {
        funcTrackidNetTables($(this).closest(".MuiDataGrid-main"));
    }, timeoutDelay);
});


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Submit request URLs
 * https://trackid.net/submitrequest
 * https://trackid.net/submitrequest?url=https://soundcloud.com/djrog/latin-vibes
 * Passing url pramater rquires the userscript "Mixes.wiki userscripts helper (by Mixes.wiki)"
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

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
