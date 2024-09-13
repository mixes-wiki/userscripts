// ==UserScript==
// @name         JunoDownload pimp (by MixesDB)
// @author       MixesDB
// @version      2024.07.13.1
// @description  Make DJ Mix related wesbites better and make online tracklists parsable for the MixesDB Tracklist Editor
// @homepageURL  https://www.mixes.wiki/w/Help:Pimp_scripts
// @supportURL   https://www.mixes.wiki/w/MixesDB:Forum/Pimp_scripts
// @updateURL    https://www.mixes.wiki/tools/userscripts/Junodownload_pimp_by_MixesDB.user.js
// @downloadURL  https://www.mixes.wiki/tools/userscripts/Junodownload_pimp_by_MixesDB.user.js
// @include      http*junodownload.com/*
// @grant        none
// @run-at       document-end
// @require      https://www.mixes.wiki/scripts/jquery/jquery-1.7.min.js
// @require      https://www.mixes.wiki/tools/userscripts/globals.js?JD_66
// @require      https://www.mixes.wiki/scripts/waitForKeyElements/waitForKeyElements.js
// ==/UserScript==

loadCSS('https://www.mixes.wiki/tools/userscripts/Junodownload_pimp_by_MixesDB.css?18');


/*
 * paths
 */
if( urlPath(1) == 'charts' || urlPath(2) == 'charts' ) {

	var chart = false,
		topChart = false,
		tl = "";

	if( urlPath(1) == 'charts' ) {
        chart = true;
    }
	if( urlPath(2) == 'charts' ) {
        topChart = true;
    }

    xc( "chart: " + chart );
    xc( "topChart: " + topChart );

    // TL chart
    if( chart ) {
        var tlWrapper = $(".container-fluid.juno-chart"),
            tlTopChartsTarget = $(".jc-top", tlWrapper),
            li = $(".jd-listing-item-track", tlWrapper);
        
        li.each(function() {

            var artist = $(".juno-artist a", this).text().replace(/ /m," "), /* &nbsp; */
                title = $("a.juno-title", this).text().replace(/ /m," "),
                label = $(".lit-label-genre a", this).text().replace(/ /m," ");

            artist = "";
            artists = $(".juno-artist a", this);
            artistsLen = artists.length;

            artists.each(function(i,e){
                artist += $(this).text();
                if( i != artistsLen - 1 ) artist += " & ";
            });

            var trackItem = artist+' - '+title;        
            xc( trackItem );

            if( label ) trackItem += ' ['+label+']\n';

            tl += trackItem;
        });
    }

    // TL top chart
    if( topChart ) {
        var tlWrapper = $(".jd-listing-item").closest(".col-12"),
            tlTopChartsTarget = $(".listing-controls",tlWrapper),
            li = $(".jd-listing-item", tlWrapper);
        
        li.each(function() {
            
            var artist = $(".juno-artist a", this).text().replace(/ /m," "), /* &nbsp; */
                title = $("a.juno-title", this).text().replace(/ /m," "),
                label = $("a.juno-label", this).text().replace(/ /m," "),
                catWrapper = $("div[data-ua_location='release header']", this),
                cat = $("div",catWrapper).first().html();
            if( cat && cat != "" ) {
                cat = cat
                    .replace( /^(.+)<.+$/g, "$1" )
                    .replace( /^(.+)<.+$/g, "$1" )
                    .replace( /\s?-\s?/g, "-" )
                    .trim();
            }

            artist = "";
            artists = $(".juno-artist a", this);
            artistsLen = artists.length;

            artists.each(function(i,e){
                artist += $(this).text();
                if( i != artistsLen - 1 ) artist += " & ";
            });

            tl += artist+' - '+title;
            if( label )        tl += ' ['+label;
            if( label && cat ) tl += ' - '+cat;
            if( label )        tl += ']\n';
        });
    }

	
    
    
    if( chart ) {
        xc( "tl before API:" );
        xc( tl );
        
        var res = apiTracklist( tl, "junoChart" ),
            tlApi = res.text,
            feedback = res.feedback;

        var url = url.replace("?ref=mdb32738923&a_cid=13eada9e","");
        tlTopChartsTarget.after('<div id="tlEditor" class="pad0"><textarea id="mixesdb-TLbox" class="mono" style="display:none; width:calc(100% - 4px); margin:10px 0 0 0;">'+ url +'\n\n' + tlApi + '</textarea></div>');
    }

    if( topChart ) {
        var res = apiTracklist( tl, "hotTracks" ),
            tlApi = res.text,
            feedback = res.feedback;

        tlTopChartsTarget.after('<div id="tlEditor" class="pad0"><textarea id="mixesdb-TLbox" class="mono" style="display:none; width:calc(100% - 4px); margin:10px 0 0 0;">' + tlApi + '</textarea></div>');
    }

    if( feedback != "" ) fixTLbox( feedback );
}


/*
 * click discount banner away
 */
waitForKeyElements("#btn-discount-no-thanks", waitBanner);
function waitBanner(jNode) {
    jNode.click();
    setTimeout(function(){
        jNode.click();
    }, 350); 
}