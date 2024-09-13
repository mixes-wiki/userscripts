// ==UserScript==
// @name         Mixcloud pimp (by MixesDB)
// @author       MixesDB
// @version      2024.07.13.1
// @description  Make DJ Mix related wesbites better and make online tracklists parsable for the MixesDB Tracklist Editor
// @homepageURL  https://www.mixes.wiki/w/Help:Pimp_scripts
// @supportURL   https://www.mixes.wiki/w/MixesDB:Forum/Pimp_scripts
// @updateURL    https://www.mixes.wiki/tools/userscripts/Mixcloud_pimp_by_MixesDB.user.js
// @downloadURL  https://www.mixes.wiki/tools/userscripts/Mixcloud_pimp_by_MixesDB.user.js
// @include      http*mixcloud.com/*
// @noframes
// @grant        none
// @run-at       document-end
// @require      https://www.mixes.wiki/scripts/jquery/jquery-1.7.min.js
// @require      https://www.mixes.wiki/tools/userscripts/globals.js?Mixcloud_pimp_20
// @require      https://www.mixes.wiki/scripts/waitForKeyElements/waitForKeyElements.js
// ==/UserScript==

loadCSS('https://www.mixes.wiki/tools/userscripts/Mixcloud_pimp.min.css?218');

var ta = '<div id="tlEditor"><textarea id="mixesdb-TLbox" class="mono" style="display:none; width:100%; margin:10px 0 0 0;"></textarea></div>';

/*
 * Fix header
 */
function headerFX(jNode) {
    $(".content .title-wrapper").after( '<div class="mixesdb-playerlist"><ul><li></li></ul></div>' )

    var apiURL = $(location).attr('href').replace(/https?:\/\/(www\.|beta\.)?mixcloud.com/, 'https://api.mixcloud.com'),
		headerList = $(".mixesdb-playerlist ul"),
        row1 = $("li:nth(0)", headerList);

    $("li:nth(1)", headerList).remove();

	if( $(".mixcloud-api").length === 0 ) row1.html( '<li id="mixApi"><a href="'+apiURL+'" class="mixcloud-api" target="_blank">API</a></li>' );

    $.getJSON(apiURL, function (json) {

        xc( "json res: " + json );

        /* fix layout */
        $(".show-stats-alt").removeClass("show-stats-alt");

        var row1 = $("#mixApi");

        /* add dur */
        var audioLength = json.audio_length,
            dur = secondsToHMS(audioLength);
        xc(dur);
        if( $("#mixDurLi").length==0 ) row1.after('<li id="mixDurLi"><span class="orange">~</span><span id="mixDur">'+dur+'</span><span class="mixesdb-tooltip orange" title="This duration can be wrong by a few minutes- The remaining duration in the bottom player is much more likely correct.">&nbsp;(?)</span><li>');
        $("#mixDur").hover().css('cursor','pointer');
        $("#mixDur").click(function(){selectText('mixDur');});

		/* artwork */
        var artworkObj = json.pictures;
		if( artworkObj && $('ul#artworkList').length===0 ) {
            artworkLinks = '<ul id="artworkList" class="nolist" style="display:none"><li>Artwork:</li>';
            // 2048 not in api
            var value2048 = "";
            $.each( artworkObj, function( index, value ) {
                if( index != "medium" && index != "large" && index != "extra_large" && index != "medium_mobile" && index != "small" && index != "thumbnail" ) {
                    if( index == "768wx768h" ) var index = "768";
                    if( index == "320wx320h" ) var index = "320";
                    if( index == "640wx640h" ) var index = "640";
                    if( index == "1024wx1024h" ) {
                        var index = "1024";
                        value2048 = value.replace("1024x1024","2048x2048");
                    }
                    artworkLink = '<li class="'+index+'"><a href="'+value+'" class="orange" target="_blank">'+index+'</a></li>';

                    if( value2048 ) {
                        artworkLink2048 = '<li class="2048"><a href="'+value2048+'" class="orange" target="_blank">2048</a></li>';
                        artworkLinks += artworkLink2048;
                    }

                    artworkLinks += artworkLink;
                }
            });


            artworkLinks += "</ul>";

            headerList.after(artworkLinks);

            var ul = $('ul#artworkList');
            ul.find('li.768').appendTo(ul);
            ul.find('li.640').appendTo(ul);
            ul.find('li.320').appendTo(ul);
            ul.show();
        }

		/* add upload date */
        var eDate = $("li:nth(2)", headerList);
        if( eDate && $("#mixDate").length==0 ) {
            var timeS = json.created_time,
                date = timeS.replace(/(.+)T.*/, '$1');
            row1.after('<li id="mixDate">'+date+'</li>');
            $("#mixDate").hover().css('cursor','pointer');
            $("#mixDate").click(function(){selectText('mixDate');});
        }
    });
}


/*
 * userProfile
 */
function userProfileFX(jNode) {
	xc( "userProfileFX" );

	// Add [X]
	if( $(".mdb-removeThis", jNode).length != 0 ) return false;

	$(".card-title", jNode).prepend('<span class="mdb-removeThis mdb-hand bold" title="Remove the player (this session only)">[X]</span>');

	$(".mdb-removeThis").click(function(){
		$(this).closest(".card").remove();
	});
}


/*
 *
 *
 * waitForKeyElements
 *
 *
 */

/*
 * mcTracklistDetected
 */
waitForKeyElements( ".tracklist-table", mcTracklistDetectedWait);
function mcTracklistDetectedWait(jNode) {
    // https://www.mixcloud.com/SuperbMixes/luke-slater-essential-mix-16-11-2019/
    
    if( $("#mixesdb-TLbox").length === 0 ) {
    
        jNode.before(ta);

        $(".tracklist-table-row-header", jNode).remove();
        var tl = "",
            li = $(".tracklist-table-row", jNode);

        li.each(function(){
            if( $(".tracklist-table-row-chapter", this).length === 1 ) {
                tl += "...\n";
            } else {
                var artist = $(".tracklist-table-row-artist", this).text(),
                    title = $(".tracklist-table-row-song", this).text();

                tl += artist + " - " + title + "\n";
            }
        });
        
        var res = apiTracklist( tl, "standard" ),
                tlApi = res.text,
                feedback = res.feedback;

        if( tlApi ) {
            $("#mixesdb-TLbox").append(tlApi).show();
            jNode.remove();
        }
        if( feedback != "" ) fixTLbox( feedback );
    }
}

/*
 * headerWait
 */
waitForKeyElements(".title-inner-wrapper", headerWait);
function headerWait(jNode) {
    headerFX();
}

/*
 * userProfileFX
 */
waitForKeyElements(".card", userProfileWait);
function userProfileWait(jNode) {
    userProfileFX(jNode);
}

/*
 * playButtonLInkClick
 */
waitForKeyElements(".playButtonLinkClick", playButtonLinkClickWait);
function playButtonLinkClickWait() {
    $(".playButtonLinkClick").click(function(){
        $(".play-button.play-button-cloudcast:not(.pause-state)").click();
    });
}

/*
 * on play button click
 */
waitForKeyElements(".play-button.play-button-cloudcast", playButtonClickWait);
function playButtonClickWait(jNode) {
    jNode.click(function(){
        xc( "play button was clicked");
        $("#wrongMixPlayingBanner").remove();
    });
}
