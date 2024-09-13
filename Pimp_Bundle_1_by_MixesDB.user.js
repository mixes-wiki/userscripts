// ==UserScript==
// @name         Pimp Bundle 1 (by MixesDB)
// @author       MixesDB
// @version      2024.07.13.1
// @description  Make DJ Mix related wesbites better and make online tracklists parsable for the MixesDB Tracklist Editor
// @homepageURL  https://www.mixes.wiki/w/Help:Pimp_scripts
// @supportURL   https://www.mixes.wiki/w/MixesDB:Forum/Pimp_scripts
// @updateURL    https://www.mixes.wiki/tools/userscripts/Pimp_Bundle_1_by_MixesDB.user.js
// @downloadRL   https://www.mixes.wiki/tools/userscripts/Pimp_Bundle_1_by_MixesDB.user.js
// @include      http*1001tracklists.com*
// @include      http*beatport.com*
// @include      http*dasding.de*
// @include      http*global-sets.com*
// @include      http*nts.live*
// @include      http*podomatic.com*
// @include      http*redbullradio.com*
// @include      http*shazam.com*
// @include      http*youtube.com/*
// @noframes
// @require      https://www.mixes.wiki/scripts/jquery/jquery-1.7.min.js
// @require      https://www.mixes.wiki/tools/userscripts/globals.js?pimp_bundle_1_37
// @require      https://www.mixes.wiki/scripts/waitForKeyElements/waitForKeyElements.js
// @run-at       document-end
// ==/UserScript==

var ta = '<div id="tlEditor"><textarea id="mixesdb-TLbox" class="mono" style="display:none; width:100%; margin:10px 0 0 0;"></textarea></div>';

/*
 * 1001 Tracklists
 */
var run1001 = true;

function thousandoneTl() {
    run1001 = false;

    $(".adRow").remove();
	// remove hidden elements that appear in text
	$(".tlUserInfo").remove();
	$(".tgHid").remove();

    var t = $("#tlTab");
    if(t.length > 0 ) {
        var tl = "",
            li = $("#tlTab > div"),
            len = li.length,
            rows = len;

        li.each(function() {

            // track
            if( $(this).attr("data-trno") != "" ) {
                var track = "",
                    song = $("div .trackValue",this).text().trim(),
                    label = $("div[itemprop='tracks'] .trackLabel",this).text().trim().toLowerCase(),
                    dur = $("div[data-mode='hours']",this).text().trim();

                if( dur != "" ) track = "["+dur+"] ";
                track += song;
                if( label != "" ) track += " ["+label+"]";

                //xc( track );
                if( track != "" && track != " " )  {
                    tl += track + "\n";
                }
            }

            // chapter
            // https://www.1001tracklists.com/tracklist/y3gt5lt/dominik-koislmeyer-jetique-energy-extravadance-charts-2021-08-28.html
            if( $(".fRow",this).length === 1 ) {
                var chapter = $(".fRow a",this).text().trim();
                if( chapter != "" ) tl += ";" + chapter + "\n";
            }

            // song chapter
            var span = $("span",this);
            if( span.attr("id") && span.attr("id").replace(/.+_(headtext_column)$/g, "$1") == "headtext_column" ) {
                var intro = span.text().trim().replace(/:$/g,"");
                if( intro != "" ) tl += "''" + intro + ":'' ";
            }
        });

        xc( tl );

        // fixes
		var tl = tl.replace('&thinsp;', ' ')
                   .replace(' (ID Remix) (ID Remix)', ' (ID Remix)')
                   .replace(/;(.+)\n\n;(.+)/g, ';$1 - $2')
                   .replace(/undefined - undefined/gi, '?');

        // dur fixes
		if( /\[\d+:\d+]/.test(tl) ) {
			tl = tl.replace( /\[(\d)] /, "[0$1:00] " )
			       .replace( /\[(\d+)] /, "[$1:00] " );
		}
		if( /\[\d\d:\d\d]/.test(tl) && /\[1:\d\d:\d\d]/.test(tl) ) {
			tl = tl.replace( /\[(\d\d:\d\d)] /gm, "[0:$1] " );
			tl = tl.replace( /\[(\d:\d\d)] /gm, "[0:0$1] " );
		}

		var res = apiTracklist( tl, "thousandoneTl" ),
			tlApi = res.text,
			feedback = res.feedback;

		if( tlApi ) {
			t.prepend( ta );
            $("#mixesdb-TLbox").css("position","inherit").append( tlApi );
		    fixTLbox( res.feedback );
		}
    }
}

if( domain == "1001tracklists.com" && urlPath(1) == "tracklist") {
    waitForKeyElements("#tlTab .trackValue", waitRun1001);
    function waitRun1001(jNode) {
        if(run1001) thousandoneTl();
    }
}


/*
 * Beatport
 */
if( domain == "beatport.com" ) {

    var up1 = urlPath(1),
		isTopChart = false;

	if( urlPath(1) == "top-100" ) isTopChart = true;

	// beatportTlApi
	function beatportTlApi( tl ) {
		if( tl != null ) {
			var tlType = "standard";
			if( isTopChart ) tlType = "hotTracks";

			var res0 = apiTracklist( tl, "capLabel" ),
				res = apiTracklist( res0.text, tlType ),
				tlApi = res.text,
				feedback = res.feedback;

			if( tlApi ) {
				if( !isTopChart ) {
					$("#mixesdb-TLbox").val(  window.location.href + "\n\n" + tlApi );
				} else {
					$("#mixesdb-TLbox").val( tlApi );
				}
				fixTLbox( res.feedback );
			}
		}
	}

    // Charts
    function beatportCharts() {
        if( $("#tlEditor").length === 0 ) {

			if( !isTopChart ) {
				$(".interior-chart-tracks").before(ta);
			} else {
				$(".interior-top").after(ta);
			}

            var tl = "",
                li = $("ul.bucket-items li.track"),
				i = 1;

            li.each(function(index) {
				var artistArr = [];

				if( !isTopChart || isTopChart && i < 51 ) {
					$(".buk-track-artists a", this).each( function() {
						artistArr.push( $(this).text().trim().replace(/(\n|\s+)/g," ") );
					});

					var artist = artistArr.join(" & "),
						title = $(".buk-track-title .buk-track-primary-title", this).text().trim(),
						remix = $(".buk-track-title .buk-track-remixed", this).text().trim().replace("Original Mix",""),
						label = $(".buk-track-labels", this).text().trim();
					if(remix) var remix = " ("+ remix + ")";
					if(label) var label = " ["+ label + "]";

					tl += artist+ " - " +title+ "" + remix + "" +label;
					if( !$(this).is(':last-child') ) tl += "\n";
				}

				i++;
            });

            beatportTlApi( tl );
        }
    }

    // Mixes
    function beatportMixes() {
        if( $("#tlEditor").length === 0 ) {
            $("table#tracks").before(ta);
            var tl = "",
                li = $("table#tracks tr.track-row"),
                dursFilled = true;

            // all durs 00?
            if( $("td.start-time:eq(1)").text().trim() == "00:00:00" ) var dursFilled = false;

            li.each(function(index) {
				var artistArr = [];
				$("td:eq(5) a", this).each(function(){
					artistArr.push( $(this).text().trim().replace(/(\n|\s+)/g," ") );
				});
                var artist = artistArr.join(" & "),
					dur = $("td:eq(3)", this).text().trim().replace(/^0/, ""),
                    title = $("td:eq(4)", this).text().trim().replace(" (Original Mix)", ""),
                    label = $("td:eq(6)", this).text().trim();
                if( !dursFilled ) {
                    var dur = "";
                } else {
                    if(dur) var dur = "["+ dur + "] ";
                }
                if(label) var label = " ["+ label + "]";
                tl += dur + artist + " - " + title + label + "\n";
            });
            beatportTlApi( tl );
        }
    }

    if( up1 == "chart" || up1 == "top-100" || up1 == "mix" ) {
        $("body").click(function() {
            if(up1 == "chart") beatportCharts();
            if(up1 == "mix") beatportMixes();
		});
    }

    if( up1 == "chart" || up1 == "top-100" ) {
        waitForKeyElements("ul.bucket-items li.track", waitRunBPc);
        function waitRunBPc(jNode) {
            beatportCharts();
        }
    }
    if( up1 == "mix" ) {
        waitForKeyElements("table#tracks tr.track-row", waitRunBPm);
        function waitRunBPm(jNode) {
            beatportMixes();
        }
    }
}


/*
 * DASDING
 */
if(domain == "dasding.de"
   && ( urlPath(1) == "playlists" || urlPath(1) == "playlist" )
  ) {
    $("#playlistsearch").after(ta);

    var tl = "",
        li = $("ul.PlaylistSearchItems li .PlaylistSong");
    li.each(function(index) {
        var artist = $(".PlaylistInterpret", this).text().replace("Leider nicht verf&uuml;gbar","+++").trim(),
            title = $(".PlaylistTitle", this).text().replace("Leider nicht verf&uuml;gbar","+++").trim();

        if(artist != "Wiederholung Vorwoche") {
            tl += artist+ " - " +title+ "\n";
        }
    });

	// API
    if( tl ) {
		var tl = tl.replace(/(.+) - \d+ bis \d+ Uhr\n/gi, ';$1\n')
    			.replace(/\+{3} - \+{3}\n(.+) - .+\n/g, '\n;$1\n')
    			.replace(/\n;\+{3}\n/g, '--\n')
    			.replace(/\+{3} - \+{3}\n/g, '')
    			.replace(/\n;/g, '\n\n;');

		var res = apiTracklist( tl, "standard" ),
			tlApi = res.text,
			feedback = res.feedback;

		if( tlApi ) {
			$("#tlEditor").addClass("fs75p").css("width","95%");
			$("#mixesdb-TLbox").val( tlApi );
			fixTLbox( res.feedback );
		}
	}
}


/*
 * global-sets.com
 */
if(domain == "global-sets.com") {
    var dlBox = $(".thickbox");
    dlBox.show();
    // http://www.global-sets.com?xb=://www16.zippyshare.com/v/9Goy5TRQ/file.html&keepThis=true&width=630&height=260
    var zippyLink = dlBox,
        zippyURL = decodeURIComponent( zippyLink.attr("href") ).replace(/.+(www\d+\.zippyshare.+\.html).+/gi, "http://$1");
    zippyLink.attr("href", zippyURL).addClass("mixesDBorange");
}


/*
 * NTS
 */
if( domain == "nts.live" ) {
    function ntsLive() {
        var tlE = $("ul.tracks");

        xc( "Tracklists found: " + tlE.length );

        tlE.each(function(){
            $(this).before( ta + '<br />' );
            var tl = "",
                li = $("li.track",this);
            li.each(function(){
                var artist = $(".track__artist:visible",this).text(),
                    title = $(".track__title:visible",this).text();
                tl += "# " + artist + " - " + title + "\n";
            });

            xc( tl );

            // API
            if( tl ) {
                var res = apiTracklist( tl, "standard" ),
                    tlApi = res.text,
                    feedback = res.feedback;

                if( tlApi ) {
                    $("#tlEditor").addClass("fs75p").css("width","95%");
                    $("#mixesdb-TLbox").val( tlApi );
                    fixTLbox( res.feedback );
                }
            }
        });
    }

    waitForKeyElements("ul.tracks", waitRunNTSlive);
    function waitRunNTSlive(jNode) {
        ntsLive();
    }
}


/*
 * PodOmatic
 */
if( domain == "podomatic.com" ) {
    document.body.onmouseup = '';
    document.body.onmousemove = '';
}

function addYoutubeShortUrl() {
    xc( "addYoutubeShortUrl()" );
    var url = $(location).attr('href'),
        embedUrl = url.replace(/^.*http.+youtube\.com\/.*watch\?(?:.+&)?v=(.{11}).*$/gi, "https://youtu.be/$1");
    xc( embedUrl );
    $(".mixesDB-shortURL").remove();
    $("#info-contents h1.title").prepend('<input class="mixesdb-input mixesDB-shortURL selectOnClick floatR" onClick="javascript:(this.select());" style="color:#828282; width:160px; padding:2px 4px; border:1px solid #ccc; border-radius:4px" value="'+embedUrl+'" />');
}


/*
 * RED BULL RADIO
 */
if(domain == "redbullradio.com") {
    function rbr() {
        var tlE = $(".c-tracklist");

        tlE.each(function(){
            $(this).before( ta + '<br />' );
            var tl = "",
                li = $(".o-container",this);
            li.each(function(){
                var artistTitle = $(".c-tracklist__artist-title",this).text().replace("–","-"),
                    label = $(".c-tracklist__track-label",this).text();
                tl += "# " + artistTitle;
                if( label ) tl += " [" + label + "]";
                tl += "\n";
            });

            xc( tl );

            // API
            if( tl ) {
                var res = apiTracklist( tl, "standard" ),
                    tlApi = res.text,
                    feedback = res.feedback;

                if( tlApi ) {
                    $("#tlEditor").addClass("fs75p").css("width","95%");
                    $("#mixesdb-TLbox").val( tlApi );
                    $("#mixesdb-TLbox").show();
                    fixTLbox( res.feedback );
                }
            }
        });
    }

    waitForKeyElements(".c-tracklist", waitRbr);
    function waitRbr(jNode) {
        // delay cos player pop up on bottom removes tl
        setTimeout( function(){
            rbr();
        }, 500 );

    }
}


/*
 * shazam.com
 */
if( domain == "shazam.com"
    && ( urlPath(1) == "track" || urlPath(2) == "track" )
  ) {
    waitForKeyElements(".details h2.artist", runShazamWait);
    function runShazamWait(jNode) {
        var wrapper = $("article .inner-content");

        wrapper.append( ta );

        var artist = $(".details h2.artist", wrapper).text(),
            title = $(".details h1.name", wrapper).text();

        if( artist != "" && title != "" ) {
            var tl = artist + ' - ' + title,
                res = apiTracklist( tl, "standard" ),
                tlApi = res.text;

            console.log( tlApi );
        }
    }
}


/*
 * YouTube
 */
if( domain == "youtube.com" ) {
    xc( "youtube.com" );

    // on first page load
    waitForKeyElements("#info-contents h1.title", waitRunYTurl);
    function waitRunYTurl(jNode) {
        addYoutubeShortUrl();
    }

    // on navigation
    document.body.addEventListener("yt-navigate-finish", function(event) {
        $(".ytd-button-renderer").attr("href");
        addYoutubeShortUrl();
    });
}