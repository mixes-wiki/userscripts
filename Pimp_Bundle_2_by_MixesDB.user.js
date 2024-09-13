// ==UserScript==
// @name         Pimp Bundle 2 (by MixesDB)
// @author       MixesDB
// @version      2024.07.13.1
// @description  Make DJ Mix related wesbites better and make online tracklists parsable for the MixesDB Tracklist Editor
// @homepageURL  https://www.mixes.wiki/w/Help:Pimp_scripts
// @supportURL   https://www.mixes.wiki/w/MixesDB:Forum/Pimp_scripts
// @updateURL    https://www.mixes.wiki/tools/userscripts/Pimp_Bundle_2_by_MixesDB.user.js
// @downloadRL   https://www.mixes.wiki/tools/userscripts/Pimp_Bundle_2_by_MixesDB.user.js
// @include      http*fritz.de*
// @include      http*traxsource.com*
// @include      http*dancetrippin.tv*
// @include      http*livetracklist.com*
// @include      http*fm4.orf.at*
// @include      http*podcasts.apple.com*
// @noframes
// @require      https://www.mixes.wiki/tools/userscripts/globals.js?pimp_bundle2_31
// @require      https://www.mixes.wiki/scripts/waitForKeyElements/waitForKeyElements.js
// @run-at       document-end
// ==/UserScript==

loadCSS('https://www.mixes.wiki/tools/userscripts/Pimp_Bundle_2_by_MixesDB.css?1');

/* DON'T ADD JQUERY */

var win = $(window),
    w = win.width(),
    ta = '<div id="tlEditor"><textarea id="mixesdb-TLbox" class="mono" style="display:none; width:100%; margin:10px 0 0 0;"></textarea></div>';


/*
 * fritz.de
 */
if(domain == "fritz.de") {
    var table = $(".playlist_aktueller_tag"),
        li = $(".play_track", table);
    if( li.length > 0 ) {
        table.before(ta);
        var tl = "";
        li.each(function(){
            var artist = $(".trackinterpret", this).text(),
                title = $(".tracktitle", this).text();
            tl += artist + " - " + title ;
            if( !$(this).is(':last-child') ) tl += "\n";
        });

		// API
		if( tl ) {
			var res = apiTracklist( tl, "standard" ),
				tlApi = res.text,
				feedback = res.feedback;

			if( tlApi ) {
				$("#tlEditor").addClass("fs75p");
				$("#mixesdb-TLbox").val( tlApi );
				fixTLbox( res.feedback );
			}
		}
    }
}


/*
 * traxsource.com
 */
if( domain == "traxsource.com" ) {
    
    redirectOnUrlChange();
    
    if(  ( urlPath(1) == "title" || urlPath(1) == "top" )
      ) {
        function traxsource(jNode) {
            var table = $(".trklist"),
                li = $(".play-trk", table),
                isTopChart = false;

            if( urlPath(1) == "top" ) isTopChart = true;

            // hide label row
            if( $(document).width() < 971 ) {
                $(".trklist .label").add(".trklist .btncell").hide();
                $(".trklist.bund.v3 .genre").show().css({"display":"inline"});
            }

            if( li.length > 0 ) {
                table.before(ta);
                var tl = "",
                    i = 1;

                li.each(function(){
                    if( !isTopChart || isTopChart && i < 51 ) {
                        var artist = "",
                            artistRow = $(".artists", this),
                            artistItem = $("a.com-artists", artistRow),
                            artistCount = artistItem.length;
                        if( artistCount == 1 ) {
                            var artist = artistItem.text().trim();
                        }
                        if( artistCount > 1 ) {
                            artistItem.each(function(){
                                artist += $(this).text() + " & ";
                            });
                            var artist = artist.trim().replace(/ &$/g, "");
                        }

                        var title = $(".title a:first", this).text().trim(),
                            version = $(".version", this).clone().children().remove().end().text().trim(),
                            label = $(".label", this).text().trim();

                        if(version) title += " (" +version+ ")";

                        var track = artist + " - " + title;
                        if(label) var track = track + " [" + label + "]";

                        tl += track;
                    }

                    if( !$(this).is(':last-child') ) tl += "\n";

                    i++;
                });

                // API
                if( tl ) {
                    var tlType = "standard";
                    if( isTopChart ) tlType = "hotTracks";

                    var res0 = apiTracklist( tl, "capLabel" ),
                        res = apiTracklist( res0.text, tlType ),
                        tlApi = res.text,
                        feedback = res.feedback;

                    if( tlApi ) {
                        var urlFresh = window.location;
                        $("#tlEditor").addClass("fs75p");
                        if( !isTopChart ) {
                            $("#mixesdb-TLbox").val( urlFresh+'\n\n'+tlApi );
                        } else {
                            $("#mixesdb-TLbox").val( tlApi );
                        }
                        fixTLbox( res.feedback );
                    }
                }
            }
        }
    }

    waitForKeyElements(".trklist", waitRun);
    function waitRun(jNode) {
        traxsource();
    }
}

/*
 * dancetrippin.tv
 */
if( domain == "dancetrippin.tv" && urlPath(1) == "videos" ) {
	var table = $(".episode-tracklist table"),
        li = $("tr.track", table);
    if( li.length > 0 ) {
        table.before(ta);
        var tl = "";
        li.each(function(){
			var dur = $("td:nth-child(2)", this).text(),
				artistTitle = $("td:nth-child(3) a", this),
				artistTitleHtml = artistTitle.html();
			
			if( artistTitleHtml ) {
				artistTitle.html( artistTitleHtml.replace( /^(.+)<br>(.+)$/gi, '<div class="artist">$2</div><div class="title">$1</div>' ) );
				
				var artistTitle = $("td:nth-child(3) a", this),
					artist = $(".artist", artistTitle).text().trim(),
					title = $(".title", artistTitle).text().trim();
				
				tl += "["+dur+"] ";
				if( title == "" ) {
					tl += "?";
				} else {
					tl += artist + " - " + title;
				}
				if( !$(this).is(':last-child') ) tl += "\n";
			}
        });

		// API
		if( tl ) {
			var res = apiTracklist( tl, "dancetrippinTV" ),
				tlApi = res.text,
				feedback = res.feedback;

			if( tlApi ) {
				$("#tlEditor").addClass("fs75p");
				$("#mixesdb-TLbox").val( tlApi );
				fixTLbox( res.feedback );
			} else {
				$("#mixesdb-TLbox").val( tl );
				fixTLbox();
			}
		}
    }
}


/*
 * LiveTracklist
 */
if( domain == "livetracklist.com" && urlPath(1) !== "" ) {
	var ol = $(".tracklist ol"),
		li = $("li", ol);
	
    if( li.length > 0 ) {
        ol.before(ta);
        var tl = "";
        li.each(function(){
			var sec = $("button.mixcloud", this).attr("value"),
				dur = secondsToMin(sec),
				artistTitle = $(".listItem", this).text().trim();
			if( artistTitle == "ID - ID" ) artistTitle = "?";
			if( artistTitle != "" ) {
				if( dur ) tl += "["+dur+"] ";
				tl += artistTitle;
				if( !$(this).is(':last-child') ) tl += "\n";
			}
		});
	}

	// API
	if( tl ) {
		var res = apiTracklist( tl, "liveTracklist" ),
			tlApi = res.text,
			feedback = res.feedback;

		if( tlApi ) {
			$("#mixesdb-TLbox").val( tlApi );
			fixTLbox( res.feedback );
		} else {
			$("#mixesdb-TLbox").val( tl );
			fixTLbox();
		}
		$("#tlEditor-feedback").addClass("small");
	}
}

/*
 * fm4.orf.at
 */
if( domain == "orf.at" && urlPath(2) == "stories" ) {
    $("table.playlist").each(function(){
        var tl = "",
            table = $(this),
            li = $("tr", table),
            remote = table.closest(".remote"),
            h3 = $("h3.tableTitle.playlist",remote);

        // possible chapter
        if( h3.text().trim() !== "" ) {
            tl += ";" + h3.text().trim() + "\n";
        } else {
            var p = remote.prev("p"),
                chapter = $("a:first",p).text().trim();

            if( chapter ) tl += ";" + chapter + "\n";
        }

        // if empty column in table
        if( $("td.col2", table).text() == "" ) {
            $("td.col2", table).remove();
        }

        table.before(ta);

        li.each(function(){
            var artist = $("td:nth(0)",this).text().trim(),
                title = $("td:nth(1)",this).text().trim(),
                label = $("td:nth(2)",this).text().trim();

            if( artist != "" && title != "" ) {
                tl += "\n" + artist + " - " + title;
            }

            if( label != "" ) {
                tl += " [" + label + "]";
            }
        });

        // API
        if( tl ) {
            var res = apiTracklist( tl, "standard" ),
                tlApi = res.text,
                feedback = res.feedback,
                url = window.location.href;

            if( tlApi ) {
                $("#mixesdb-TLbox").val( tlApi ).css("width","66.5%");
                fixTLbox( feedback );
            }

            $("#tlEditor > *").css("width","66.5%");

            $("#tlEditor-feedback").addClass("small");
        }
    });
}



/*
 * podcasts.apple.com
 */
if( domain == "apple.com" ) {
    jQuery.createEventCapturing(['play']);

    // on click play > add full download url
    jQuery('body').on('play', 'audio#apple-music-player', function(){
        xc( "audio playback started." );
        var url = $(this).attr("src"),
            urlBox = '<p class="mixesdb-pimp-url" style="padding:1em 0 0; word-break:break-all"><a href="'+url+'" target="_self" style="color:#f70 !important">'+url+'</a></p>';
        console.log( url ) ;

        setTimeout(function(){
            var pauseButton = $("#audio-controls-playback.icon-pause");
            // podcast episodes list
            var target = pauseButton.closest(".tracks__track--podcast");

            // single episode page
            if( target.length == 0 ) {
                var target = pauseButton.closest(".product-controls--artwork-controls");
            }

            if( target.length !== 0 && $(".mixesdb-pimp-url",target).length === 0 ) {
                target.append( urlBox );
            }
        }, 1500);
    });
}


