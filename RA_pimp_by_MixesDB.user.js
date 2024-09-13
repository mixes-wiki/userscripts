// ==UserScript==
// @name         RA pimp (by MixesDB)
// @author       MixesDB
// @version      2024.07.13.1
// @description  Make DJ Mix related wesbites better and make online tracklists parsable for the MixesDB Tracklist Editor
// @homepageURL  https://www.mixes.wiki/w/Help:Pimp_scripts
// @supportURL   https://www.mixes.wiki/w/MixesDB:Forum/Pimp_scripts
// #@updateURL   https://www.mixes.wiki/tools/userscripts/RA_pimp_by_MixesDB.user.js
// #@downloadRL  https://www.mixes.wiki/tools/userscripts/RA_pimp_by_MixesDB.user.js
// @include      http*residentadvisor.net*
// @noframes
// @require      https://www.mixes.wiki/tools/userscripts/globals.js?RA_pimp_10
// @require      https://www.mixes.wiki/scripts/waitForKeyElements/waitForKeyElements.js?0
// ==/UserScript==

// DO NOT ADD JQUERY

$("body").addClass("mixesdb-ra");

$("#pnlLeader").remove();
$("#featureHead ").css('max-height','250px');

//charts overview page
if( urlPath(1).replace(/(.+)\?.*/g,'$1') == "dj-charts.aspx" ) {
    $('.plus8 .fl.col2').hide();
    $('.plus8 .col4-6').css('width','100%');
}

var tlApi = "",
	top50 = false;

// Chart page
if( urlPath(1) == "dj" && $("ul.chart").length > 0 ) {
    $("#tracks .heading").remove();
    var c = $("ul#tracks.chart"),
        li = $("li", c),
        len = $("ul#tracks.chart li").length,
		tl = "",
		url = url+'\n\n';
	
	// TL
    li.each(function(index) {
        $('.label .comments').remove();
        var labelCat = "",
            artist = $(".artist", this).text().replace("Artist /",""),
            track = $(".track", this).text().replace("Track title (remix) /","").replace("(", " (").replace("  ", " ");
        if( $(".label", this).children().length > 0 ) {
            var label = $(".label a", this).text(),
                cat = $(".label div", this).text();
        } else {
            var label = $(".label", this).text(),
                cat = "";
        }
        if( cat !== "" ) var cat = " - "+cat;
        if( label !== "" ) var labelCat = " ["+label.replace("Label (catnum) /","")+""+cat+"]";
        if( cat ) var cat = " - " + cat;
		
        tl += "# " + artist + " - " + track + labelCat;
        if( index != len-1 ) {
            tl += "\n";
        }
    });
}

// Top chart
if( urlPath(1) != "dj" && $("#tracks").length > 0 ) {
	var top50 = true,
		c = $("#tracks");
    $("tr:first-child", c).remove();
    var li = $("tbody tr", c),
        len = $("#tracks tbody tr").length,
		tl = "",
		url = "";
    li.each(function(index) {
        var artist = $("td:nth-child(3)", this).text(),
            track = $("td:nth-child(4)", this).text();
        if( artist !== "Massimo Vivona" ) {
            tl += "# " + artist + " - " + track;
        }
        if(index != len-1) {
            tl += "\n";
        }
    });

    // List only 50
    var tl = tl.replace(/^\s*[\r\n]/gm, '');
    //console.log( tl );

    // keep onyl first 50
    var tl = tl.split(/\n/).slice(0,50).join('\n');
    console.log( tl );

    // prepend tl text
	var c = c.parent();
}

// API
function onYouTubeIframeAPIReady(){
	return true;
}
var res = apiTracklist( tl, "standard" ),
	tlApi = res.text,
	feedback = res.feedback;

if( top50 ) {
	var res = apiTracklist( tlApi, "hotTracks" ),
		tlApi = res.text,
		feedback = res.feedback;
}

if( tlApi !== "" && tlApi != "?" ) {
	c.prepend('<div id="tlEditor" class="fs75p"><textarea id="mixesdb-TLbox" class="mono" style="width:100%; margin-bottom:16px" rows="11">'+url+tlApi+'</textarea></div>');
	fixTLbox( feedback );
}
