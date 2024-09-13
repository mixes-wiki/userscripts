// ==UserScript==
// @name         TrackId.net pimp (by MixesDB)
// @author       MixesDB
// @version      2024.07.18.1
// @description  Make DJ Mix related wesbites better and make online tracklists parsable for the MixesDB Tracklist Editor
// @homepageURL  https://www.mixes.wiki/w/Help:Pimp_scripts
// @supportURL   https://www.mixes.wiki/w/MixesDB:Forum/Pimp_scripts
// @updateURL    https://www.mixes.wiki/tools/userscripts/TrackId.net_pimp_by_MixesDB.user.js
// @downloadRL   https://www.mixes.wiki/tools/userscripts/TrackId.net_pimp_by_MixesDB.user.js
// @include      http*trackid.net*
// @noframes
// @require      https://www.mixes.wiki/scripts/jquery/jquery-1.7.min.js
// @require      https://www.mixes.wiki/tools/userscripts/globals.js?trackidnet_2
// @require      https://www.mixes.wiki/tools/userscripts/youtube_funcs.js
// @require      https://www.mixes.wiki/scripts/waitForKeyElements/waitForKeyElements.js
// @run-at       document-end
// ==/UserScript==

loadCSS('https://www.mixes.wiki/tools/userscripts/TrackId.net_pimp_by_MixesDB.css?40');

var timeoutDelay = 500,
    ta = '<div id="tlEditor"><textarea id="mixesdb-TLbox" class="mono" style="display:none; width:100%; margin:10px 0 0 0;"></textarea></div>',
    checkIcon = '<img class="mdb-checked-icon" src="data:image/png;base64,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" alt="Checked">';

/*
 *
 *
 * funcs
 *
 *
 */

// getAudiostream
function getAudiostream() {
    return window.location.pathname.replace("/audiostreams/", "");
}


// trackidNet_FixTitle
function trackidNet_FixTitle(text) {
    if (text) {
        var textOut = text.replace(/[|-]/g, " ")
            .replace(/(#|\[|]|\(|\)|\.|\*| I )/g, " ")
            .replace(/ (Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)( |-|$)/g, " ")
            .replace(/\s+/g, " ")
            .replace(/(\/)/g, " ")
            .replace(/ (on) /g, " ")
            .replace(/RA (\d)/g, "RA.$1")
            .trim();
        return textOut;
    }
}

// trackidTitleToUrl
function trackidTitleToUrl(title) {
    return title.trim().toLowerCase()
        .replace(/_/g, "-")
        .replace(/[-()—.?!/']/g, "")
        .replace(/Á|À|Ã|Â|Ä/gi, "a")
        .replace(/Ç/gi, "c")
        .replace(/É|È|Ê|Ë/gi, "e")
        .replace(/Í|Ì|Î|Ï/gi, "i")
        .replace(/Ñ/gi, "o")
        .replace(/Ó|Ò|Ô|Õ|Ö|Ø/gi, "o")
        .replace(/Ú|Ù|Û|Ü/gi, "u")
        .replace(/\s/g, "-")
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // normalize accents é > e
        .replace(/[^a-z0-9]+/g, "-");
}


// searchOnMixesDB
function searchOnMixesDB(text, target, size) {
    if (text !== "") {
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
        xc("searchOnMixesDB(): No text!");
    }
}


// .mdbSearchLink on click
waitForKeyElements(".mdbSearchLink-list", waitSearchLink_onclick);
function waitSearchLink_onclick(jNode) {
    jNode.on('click', function () {
        $(".mdbSearchLink-list").removeClass("active");
        jNode.addClass("active visited");
    });
}

// trackidnet check
// check if audiostream is ion db
// audiostream_s = 1 string or comma-separated
// returns timestamp
function trackidnet_checked(queryDo, audiostream_s) {
    // trackidnet_checked_check
    // trackidnet_checked_check_batch
    // trackidnet_checked_save
    // trackidnet_checked_delete
    xc("trackidnet_checked(): " + queryDo);

    var data = {
        query: queryDo,
        url: audiostream_s
    };

    if (queryDo == "trackidnet_checked_check_batch") {
        data = {
            query: queryDo,
            list: audiostream_s
        };
    }

    if (queryDo != "") {
        var jqXHR = $.ajax({
            type: "POST",
            url: apiUrlTools,
            data: data,
            async: false
        });

        var res = JSON.parse(jqXHR.responseText);

        // confirm
        switch (queryDo) {
            case "trackidnet_checked_save":
                $("#pageCheckSave-wrapper").hide();
                $("#pageCheck-text .check-ok").fadeIn();
                break;
            case "trackidnet_checked_delete":
                $("#pageCheck-text .check-ok").hide();
                $("#pageCheckSave").prop("checked", false); // uncheck box
                $("#pageCheckSave-wrapper").fadeIn();
        }

        return res;
    }
}


// funcTrackidNetUsername
// highlight MixesDB users
function funcMixesdbPageCheck(target) {
    xc("funcMixesdbPageCheck()");

    var saveText = 'Save as compared <span>(not if this mix is not on MixesDB) <span style="color: coral">[coming soon!]</span></span>',
        saveTitle = 'Check if you found this mix on MixesDB, compared the tracklists and edited the MixesDB page for possible new tracks',
        saveFunction = '<span id="pageCheckSave-wrapper"><input type="checkbox" id="pageCheckSave"><span class="pageCheckSave-text" title="' + saveTitle + '">' + saveText + '</span></span>',
        checkedText = '<span class="check-ok hidden">' + checkIcon + ' This tracklist was checked against MixesDB <a href="javascript:void(0);" id="pageCheckDelete">undo</span></span>';

    target.append('<tr id="mixesdbPageCheck"><td class="pageInfoTable-label">MixesDB check</td><td id="pageCheck-text">' + saveFunction + checkedText + '</td></tr>');

    // get audiostream url path
    var audiostream = getAudiostream();
    if (audiostream) {
        xc(audiostream);

        // check if page is checked
        var res = trackidnet_checked("trackidnet_checked_check", audiostream);
        if (res !== null) {
            var timestamp = res.timestamp;
            if (timestamp) {
                // is checked
                $("#pageCheckSave-wrapper").hide();
                $("#mixesdbPageCheck .check-ok").show();
            }
        }
    }
}


// #pageCheckSave
function funcPageCheckSave_onclick(jNode) {
    jNode.change(function () {
        //xc( "input change" );
        var audiostream = getAudiostream();

        if ($(this).prop('checked') && audiostream) {
            xc("checked");
            trackidnet_checked("trackidnet_checked_save", audiostream);
        }
    });
}

waitForKeyElements("#pageCheckSave", waitPageCheckSave_onclick);
function waitPageCheckSave_onclick(jNode) {
    funcPageCheckSave_onclick(jNode);
}


// #pageCheckDelete
function funcPageCheckDelete_onclick(jNode) {
    jNode.click(function () {
        var audiostream = getAudiostream();
        trackidnet_checked("trackidnet_checked_delete", audiostream);
    });
}

waitForKeyElements("#pageCheckDelete", waitPageCheckDelete_onclick);
function waitPageCheckDelete_onclick(jNode) {
    funcPageCheckDelete_onclick(jNode);
}


// funcPageInfo
function funcPageInfo(wrapper) {
    var imageWrapper = $("img.artwork", wrapper).closest('div'),
        gridWrapper = $(".audio-stream-box"),
        grid = $(".MuiGrid-container", gridWrapper);

    imageWrapper.hide();

    // grid to table
    var labels = [];
    var values = [];
    $(".MuiBox-root", grid).each(function () {
        $(".MuiGrid-item:first-of-type", this).each(function () { // count starts with 0?
            labels.push($(this).text().trim());
        });
        xc(labels);

        $(".MuiGrid-item:nth-of-type(2)", this).each(function () {
            values.push($(this).text().trim());
        });
        xc(values);
    });

    grid.after('<table id="pageInfoTable"><tbody></tbody></table>');
    var tbody = $("#pageInfoTable tbody");

    $.each(labels, function (index, value) {
        tbody.append('<tr id="' + value.replace(/\s/g, '') + '" data-row-number="' + index + '"><td class="pageInfoTable-label">' + value + '</td></tr>');
    });

    $.each(values, function (index, value) {
        $("#pageInfoTable tr[data-row-number='" + index + "']").append('<td class="pageInfoTable-text">' + value + '</td>');
    });

    grid.hide();

    if (urlPath(1) != "submitrequest") {
        funcMixesdbPageCheck(tbody);
    }
}


// funcTrackidNetMenu
function funcTrackidNetMenu(menu) {
    var linkSubmitRequest = '<a id="mdb-menu-SubmitRequests" class="mdb-topBar-link" href="/submitrequest">Submit</a>',
        linkMyRequests = '<a id="mdb-menu-MyRequests" class="mdb-topBar-link" href="/myrequests">My Requests</a>',
        linkMyFavs = '<a id="mdb-menu-MyFavourites" class="mdb-topBar-link" href="/myfavourites">My Favs</a>';

    $(".account-username").closest(".MuiBox-root").before(linkSubmitRequest, linkMyRequests, linkMyFavs);

    // hide left menu, but not on homepage
    if (urlPath(1) !== "") {
        menu.hide();
        menu.next(".MuiGrid-root").hide();
    }
}


// funcTrackidNetFooter
function funcTrackidNetFooter(jNode) {
    var linkContact = '<a class="mdb-footer-link" href="/account/contactus">Contact</a>',
        linkHelp = '<a class="mdb-footer-link" href="/help">Help</a>';

    jNode.append(linkContact, linkHelp);
}


// funcTrackidNetTracklist
// via table #mdb-trackidnet-table
function funcTrackidNetTracklist(tlWrapper) {
    tlWrapper.addClass("tlEditor-processed");
    xc("funcTrackidNetTracklist()");

    // hide banner
    $(".MuiAlert-root.MuiAlert-standardInfo").hide();
    $(".MuiGrid-container.request-summary").css("margin-top", "0");

    var heading = $(".MuiGrid-container .MuiGrid-grid-xs-12 p.MuiTypography-body1").first(),
        mixTitle = heading.text(),
        totalDur = $("p.MuiTypography-body1:contains('Duration')").closest("div").next(".MuiGrid-item").text(),
        totalDur_Sec = durToSec(totalDur);
    xc(mixTitle);
    xc("totalDur: " + totalDur);

    // link to MixesDB search
    if ($("#mdbSearchLink").length === 0
        && urlPath(1) != "musictracks"
        && mixTitle !== "Tracklist Search" && mixTitle !== "My Requests" && mixTitle !== "My Favourites"
    ) {
        var searchLink = searchOnMixesDB(mixTitle, "detail page", 32);
        if (searchLink) heading.append(searchLink);
    }

    // iterate
    var tl = "",
        li = $("tr", tlWrapper),
        i = 1;

    xc("li.length:" + li.length);

    li.each(function () {
        var thisTrack = "",
            artist = $(".artist", this).text(),
            title = $(".title", this).text().replace(/(.+) - (.+ (?:Remix|Mix|Version))/g, "$1 ($2)"),
            label = $(".label", this).text(),
            startTime = $(".startTime", this).text(),
            startTime_Sec = durToSec(startTime),
            endTime = $(".endTime", this).text(),
            endTime_Sec = durToSec(endTime),
            previousTrack = $(".MuiDataGrid-row:eq(" + (i - 2) + ")"), // eq starts at 0
            endTimePrevious = $(".MuiDataGrid-cell[data-field='endTime']", previousTrack).text(),
            endTimePrevious_Sec = durToSec(endTimePrevious),
            nextTrack = $(".MuiDataGrid-row:eq(" + (i) + ")"), // eq starts at 0
            startTimeNext = $(".MuiDataGrid-cell[data-field='startTime']", nextTrack).text(),
            startTimeNext_Sec = durToSec(startTimeNext);

        xc("artist: " + artist);

        // remove label when its actually the artist repeated
        if (label == artist) {
            label = "";
        }

        // dur
        if (startTime !== "") {
            // first track is gap?
            if (i == 1) {
                // start tl with gap when first dur is larger than 120(?)
                if (startTime_Sec > 120) {
                    tl += '[0:00:00] ?\n...\n';
                }
            }
            thisTrack += '[' + startTime + '] ';
        }

        // artist - title
        if (artist && title !== "") {
            thisTrack += artist + ' - ' + title;
        }

        // label
        if (label !== "") {
            thisTrack += ' [' + label + ']';
        }

        tl += thisTrack;
        //xc( thisTrack );

        // gaps
        // add "..." row if gap is too laarge
        if (!$(this).is(':last-child')) {
            // not last track
            gapSec = startTimeNext_Sec - endTime_Sec;
            //xc( "> endTime: " + endTime );
            //xc( "> next startTime: " + startTimeNext );
            //xc( "> gapSec: " + gapSec );

            if (gapSec > 30) {
                tl += "\n[" + endTime + "] ?";
                if (gapSec > 180) {
                    tl += "\n...";
                }
            }
            tl += "\n";

        } else {
            // last track
            //xc( "> last track" );
            //xc( "> lastTrack_gap: " + lastTrack_gap );
            var lastTrack_gap = totalDur_Sec - endTime_Sec;
            //xc( "> lastTrack_gap: " + lastTrack_gap );

            // is the last track close to end or possible gap?
            if (lastTrack_gap > 70) {
                tl += "\n[" + endTime + "] ?";
            }
            if (lastTrack_gap > 240) {
                tl += "\n...";
            }
        }

        i++;
    });

    // API
    tl = tl.trim();

    xc("tl before API:\n" + tl);

    if (tl !== "") {

        var res = apiTracklist(tl, "trackidNet"),
            tlApi = res.text;
        //xc( "tlApi:\n" + tlApi );

        if (tlApi) {
            tlWrapper.before(ta);
            $("#mixesdb-TLbox").val(tlApi);
            fixTLbox(res.feedback);
        }
    } else {
        xc("tl empty");
    }
}


// funcTrackidNetTables
// fix ugly grid layout to proper tables
function funcTrackidNetTables(jNode) {
    xc("tables");
    $("#mdb-trackidnet-table").remove();

    var audiostreams = [],
        heading = $(".MuiGrid-grid-xs-12 h5.MuiTypography-h5"),
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
            xc("get urls" + $(this).html());
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

            xc("table addPlay: " + addPlay);
            xc("table addCheck: " + addCheck);

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
            xc("listItemText: " + listItemText);

            var mixTitle = listItemText,
                checkAction = "–",
                searchLink = searchOnMixesDB(mixTitle, "list", 26);
            if (searchLink) checkAction = searchLink;

            if (addCheck) {
                thisTr.append('<td class="mixesdbPageCheck-status center"><span class="mixesdbPageCheck-status-no hidden">' + checkAction + '</span></td>');
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

    xc("audiostreams: " + audiostreams);
    xc("> length: " + audiostreams.length);
    if (audiostreams.length > 0) {
        xc("about to run trackidnet_checked_check_batch");

        var list = audiostreams.join(", "),
            res = trackidnet_checked("trackidnet_checked_check_batch", list);
        if (res !== null) {
            $.each(res, function () {
                var audiostream = $(this)[0].audiostream,
                    timestamp = $(this)[0].timestamp;
                xc(audiostream);

                $("tr[data-audiostream='" + audiostream + "'] td.mixesdbPageCheck-status").html(checkIcon);
            });
            $(".mixesdbPageCheck-status-no").show();
        }
    }
}


// funcTrackidNetTracks
// add YouTube link icons
// row = .MuiDataGrid-main .MuiDataGrid-row
function funcTrackidNetTracks(wrapper) {
    xc("funcTrackidNetTracks()");

    // add column
    var header = $(".MuiDataGrid-columnHeadersInner", wrapper),
        row = $(".MuiDataGrid-row", wrapper);

    $('.MuiDataGrid-columnHeader', header).first().before('<div class="yt-row MuiDataGrid-columnHeader processed"><div class="MuiDataGrid-columnHeaderTitle"></div></div>');

    row.each(function () {
        // add icon
        var thisDataId = $(this).attr("data-id"),
            mdbRow = $("#mdb-trackidnet-table tr#" + thisDataId + ""),
            artist = $(".artist", mdbRow).text().replace(/, /g, " "),
            title = $(".title", mdbRow).text(),
            artistTitle = artist + " " + title;

        var searchString = normalizeYoutubeTitle(artistTitle),
            searchStringE = encodeURIComponent(searchString);

        var ytIcon = '<img height="12" src="data:image/png;base64,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" alt="YouTube icon">',
            icon = '<a href="https://www.youtube.com/results?search_query=' + searchStringE + '" title="Search &quot;' + searchString + '&quot; on YouTube" target="_blank">' + ytIcon + '</a>';

        $(this).prepend('<div class="MuiDataGrid-cell yt" data-artisttitle="' + artistTitle + '">' + icon + '</div>');
    });
}


// funcTrackidNetPlayers
function funcTrackidNetPlayers(jNode, url) {
    xc(url);

    // get domain
    var a = document.createElement('a');
    a.href = url;
    var domain = a.hostname.replace("www.", ""),
        paths = a.pathname;
    xc("> " + domain);
    xc("> " + paths);

    // prepare embed code
    switch (domain) {
        case "soundcloud.com": // https://soundcloud.com/fingermanedit/fingerman-dj-set-kvs-brussels
            var embed = '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?visual=false&amp;url=' + url + '&amp;auto_play=false&amp;&amp;maxheight=120&amp;buying=false&amp;show_comments=false&amp;color=ff7700&amp;single_active=true&amp;show_reposts=false"></iframe>';
            break;
        case "mixcloud.com": // https://www.mixcloud.com/oldschool/sharam-jey-rave-satellite-1995/
            var feedPath = encodeURIComponent(paths),
                embed = '<iframe width="100%" height="120" src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=' + feedPath + '" frameborder="0" ></iframe>';
            break;
        case "youtube.com": // https://www.youtube.com/watch?v=qUUYWIsfY90
            var id = youtube_parser(url),
                embed = '<iframe width="100%" height="315" src="https://www.youtube.com/embed/' + id + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
            break;
    }
    //xc( embed );

    // embed player
    $("#mdb-player").remove();
    if (embed) {
        jNode.closest(".MuiBox-root").after('<div id="mdb-player">' + embed + '</div>');
    }
}

// trackidNet_SubmitRequest
function trackidNet_SubmitRequest() {
    $("input[type='text']").select().focus();
}


/*
 *
 *
 * on apge loads
 *
 *
 */

// on page change + waitForKeyElements
redirectOnUrlChange();

// on search page
xc("On search page?");
//xc( window.location.pathname );
xc("keywords: " + getURLParameter("keywords"));
if (window.location.pathname == "/audiostreams" && getURLParameter("keywords") !== null) {
    //xc( "On search page!" );
    var searchHint = '<div id="mdb-searchHint">';
    searchHint += '<p>TrackId.net pages use the title of the players. Those often don\'t match the MixesDB page titles.</p>';
    searchHint += '<p>It\'s often faster to search for the player URL: Copy the player URL on MixesDB and <a href="/submitrequest">submit it</a> – this will find the duplicate.</p>';
    searchHint += '</div>';

    waitForKeyElements(".filter", waitSearchform);
    function waitSearchform(jNode) {
        jNode.after(searchHint);
    }
}

// fix title tag
$("head title").on('DOMSubtreeModified', function () {
    var titleTag = $("head title");
    //xc( "titleFix: title tag changed" );

    if (!titleTag.hasClass("processed")) {
        var titleText = titleTag.text();
        //xc( "titleFix: titleText: " + titleText );

        if (titleText.startsWith("TrackId.net - Tracklist for ")) {
            var textFix = titleText.replace("TrackId.net - Tracklist for ", "").trim();

            titleTag.text(textFix).addClass("processed");
        }
    }
});

// remove adblocker notice
waitForKeyElements("ins", waitAdblockerNotice);
function waitAdblockerNotice(jNode) {
    jNode.remove();
}
waitForKeyElements(".MuiBackdrop-root", waitAdblockerNoticeTwo);
function waitAdblockerNoticeTwo(jNode) {
    jNode.remove();
}

// remove button "Add Music Track"
waitForKeyElements(".music-track-data-grid .MuiButton-startIcon", waitRemoveAddMusicTrack);
function waitRemoveAddMusicTrack(jNode) {
    jNode.closest(".MuiButton-root").remove()
}

// title tag
waitForKeyElements("head title", waitTitleTag);
function waitTitleTag(jNode) {
    setTimeout(function () {
        xc("titleTag: " + jNode.text());
        var titleR = jNode.text().replace("TrackId.net - ", "");
        jNode.text(titleR);
    }, timeoutDelay);
}

// on click in menu
waitForKeyElements(".MuiListItemButton-gutters span", waitMenuClick);
function waitMenuClick(jNode) {
    //xc( "click" );
    // remove leftover players
    jNode.click(function () {
        $("#mdb-player").remove();
    });
}

// headlines to distinguish page loads
waitForKeyElements(".MuiTypography-h5", waitHeadlines);
function waitHeadlines(jNode) {
    var hlText = jNode.text().replace(/ /g, "");

    // redirect homepage
    if (hlText == "WelcometoTrackId.net-Yoursourcefortracklists.") {
        window.location.replace("/audiostreams?sortField=EndDate&sortDirection=desc&status=3");
    }

    // headline name to body class for css
    if (hlText != "StatsSummary") {
        $("body").removeAttr('class').addClass(hlText);
    }

    // page specific funcs
    if (hlText == "SubmitRequest") trackidNet_SubmitRequest();
}

// mixesdbPageCheck
waitForKeyElements(".MuiGrid-container.request-summary:not(.processed)", waitMixesdbPageCheck);
function waitMixesdbPageCheck(jNode) {
    jNode.addClass("processed");
    if (urlPath(1) != "musictracks") {
        funcPageInfo(jNode);
    }
}

// menu to top bar and footer
waitForKeyElements("#nested-list-subheader:not('.processed')", waitMenu);
function waitMenu(jNode) {
    jNode.addClass("processed");
    funcTrackidNetMenu(jNode.closest(".MuiGrid-root"));
}
waitForKeyElements(".app-footer", waitFooter);
function waitFooter(jNode) {
    funcTrackidNetFooter(jNode);
}

// tracklist waitForKeyElements
waitForKeyElements("#mdb-trackidnet-table:not('.tlEditor-processed')", waitTracklist);
function waitTracklist(jNode) {
    funcTrackidNetTracklist(jNode);
}

// tables
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
// on tracklist tables from replaced grid
waitForKeyElements(".MuiDataGrid-main", waitTracks);
//waitForKeyElements(".music-track-data-grid #mdb-trackidnet-table tr", waitTracks);
function waitTracks(jNode) {
    funcTrackidNetTracks(jNode);
}


// players waitForKeyElements
waitForKeyElements(".request-summary img.artwork", waitPlayers);
function waitPlayers(jNode) {
    var url = jNode.closest("a").attr("href");
    xc("embed url: " + url);
    if (url != "") {
        funcTrackidNetPlayers(jNode, url);
    }
}


// mixesdbCheckFromTitle()
function mixesdbCheckFromTitle(title, button) {
    xc("mixesdbCheckFromTitle()");
    xc("title: " + title);
    // Normalize title to url
    // Klaudia Gawlas – FAZEmag In The Mix 144
    // klaudia-gawlas-fazemag-in-the-mix-144
    var mixTitle = trackidTitleToUrl(title),
        checkAction = "–",
        searchLink = searchOnMixesDB(mixTitle, "list", 26);
    xc(" mixTitle: " + mixTitle);

    if (searchLink) checkAction = searchLink;

    // check if page is checked
    var res = trackidnet_checked("trackidnet_checked_check", mixTitle);
    if (res !== null) {
        var timestamp = res.timestamp;
        // is checked
        if (timestamp) {
            var mixesDBcheckOK = '<p id="mixesdbPageCheck"><span class="check-ok" style="display: inline;">' + checkIcon + ' This tracklist was checked against MixesDB</span></p>';
            button.before(mixesDBcheckOK);
        } else {
        }
    }
}

// Button "View Tracklist" > add MixesDB check
waitForKeyElements(".MuiButton-containedPrimary", waitButtonViewTracklist);
function waitButtonViewTracklist(jNode) {
    if (urlPath(1) == "submitrequest") {
        xc("button View Tracklist");
        if (jNode.text() == "View Tracklist") {
            var title = $("#Title .pageInfoTable-text").text();
            //xc( title );
            mixesdbCheckFromTitle(title, jNode);
        }
    }
}


// move rating
waitForKeyElements(".MuiRating-root", waitRating);
function waitRating(jNode) {
    var ratingWrapper = jNode.closest(".MuiBox-root");
    ratingWrapper.addClass("mdb-rating-wrapper");
    ratingWrapper.appendTo(".music-track-data-grid");
}