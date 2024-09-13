// ==UserScript==
// @name         BBC pimp (by Mixes.wiki)
// @author       Mixes.wiki
// @version      2024.07.13.1
// @description  Make DJ Mix related wesbites better and make online tracklists parsable for the Mixes.wiki Tracklist Editor
// @homepageURL  https://www.mixes.wiki/w/Help:Pimp_scripts
// @supportURL   https://www.mixes.wiki/w/Mixes.wiki:Forum/Pimp_scripts
// @updateURL    https://www.mixes.wiki/tools/userscripts/BBC_pimp_by_MixesDB.user.js
// @downloadRL   https://www.mixes.wiki/tools/userscripts/BBC_pimp_by_MixesDB.user.js
// @include      http*bbc.co.uk*
// @noframes
// @run-at       document-end
// @require      https://www.mixes.wiki/scripts/jquery/jquery-1.7.min.js
// @require      https://www.mixes.wiki/tools/userscripts/globals.js?BBC_7
// @require      https://www.mixes.wiki/scripts/waitForKeyElements/waitForKeyElements.js
// @require      https://www.mixes.wiki/scripts/jquery/plugins/jquery.browser.js
// ==/UserScript==

$("#superpromos").remove();

/*
 * main
 */
function mainFX() {
    var ep = $(".prog-layout.programmes-page"),
        ul = $("ul.segments-list__items"),
        rows = $("li", ul).length,
		tl = "";
	
    if(rows > 0 ) {
		if( $("#tlEditor").length === 0 ) $(ep).prepend('<div id="tlEditor" class="fs75p"></div>' );
		
      $("> li, > li ul li", ul).each(function(){

          /* Chapters */
          if( $(this).hasClass('segments-list__item--group') ) {
              var chapter = $("> h3", this).text().trim();
              //console.log("C: " + chapter);
              tl += "\n;" + chapter + "\n";
          }

          // Track items */
          if( $(this).hasClass('segments-list__item--music') ) {
              /* Build artist */
              //var artist = $('.segment__track span.artist', this).text();
              //artist can be 2 span.artist joined by " and " > bbc.co.uk/programmes/b03dshct
              var artist = "Unknown",
                  artistItem = $('.segment__track h3 span.artist, .segment__track h4 span.artist', this),
                  artistCount = artistItem.length;
              if( artistCount == 1 ) {
                  var artist = artistItem.text().trim();
              }
              if( artistCount > 1 ) {
                  var artist = "";
                  artistItem.each(function(){
                      artist += $(this).text() + " & ";
                  });
                  var artist = artist.trim().replace(/ &$/g, "");
              }
              var artist = artist.replace(/\[Unknown]/gi, "Unknown");

              /* Build title */
              //fix span.title "Artist - Title" like > bbc.co.uk/programmes/b03f4lgk
              //var titleRx = new RegExp(artist + " - ", "g");
              //var title = title.replace(titleRx, '');
              var title = $('.segment__track p.no-margin', this).text().replace(/\s/gm," ").trim();


              /* Build label */
              var label = $('.segment__track abbr[property="publisher"] span', this).text()
			               .trim().replace(/^Unknown$/gi, "");

              
              console.log("A: " + artist);
              console.log("T: " + title);
              console.log("L: " + label);
              console.log("---------------------------------------------------------------");


              /* Build tracklist */
              if(artist && title)  tl += "# " + artist + " - " + title;
              if(label) tl += " ["+ label +"]";
              if(artist && title)  tl += "\n";

              /* End of Chapter? */
              // Check if current li is last in nested ul group
              if( $(this).is(':last-child') ) {
                  if( $(this).parent("ul").hasClass('segments-list__group-items') ) {
                      tl += "\n;Chapter\n";
                  }
              }
          }
      });
    }
	
	// API
	if( $("#mixesdb-TLbox").length === 0 ) {
        console.log( tl );
        var res = apiTracklist( tl, "standard" ),
			tlApi = res.text,
            tlApiFix = tlApi.replace( /\[/g, "(" ).replace( /\]/g, ")" ),
			feedback = res.feedback;

		if( tlApiFix ) {
			$("#tlEditor").append('<textarea id="mixesdb-TLbox" class="mono" style="width:100%; margin:10px 0 0 0;">'+tlApiFix+'</textarea>');
			fixTLbox( res.feedback );
		}
	}
}


/*
 * 
 * Run funcs
 * 
 */
waitForKeyElements("ul.segments-list__items", mainWait);
function mainWait(jNode) {
    mainFX();
}
