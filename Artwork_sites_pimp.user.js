// ==UserScript==
// @name         Artwork sites pimp (by Mixes.wiki)
// @author       Mixes.wiki - formerly MixesDB
// @version      2024.07.13.1
// @description  Make it easier to grab hi-res artwork from various websites (you need to allow popups on discogs.com)
// @homepageURL  https://www.mixes.wiki/w/Help:Pimp_scripts
// @supportURL   https://www.mixes.wiki/w/Mixes.wiki:Forum/Pimp_scripts
// @updateURL    https://www.mixes.wiki/tools/userscripts/Artwork_sites_pimp.user.js
// @downloadRL   https://www.mixes.wiki/tools/userscripts/Artwork_sites_pimp.user.js
// @include      http*albumartexchange.com*
// @include      http*music.apple.com*
// @include      http*bandcamp.com*
// @include      http*bendodson.com/projects/itunes-artwork-finder*
// @include      http*discogs.com*
// @include      http*hhv.de*
// @noframes
// @grant        none
// @require      https://www.mixes.wiki/scripts/jquery/jquery-1.7.min.js
// @require      https://www.mixes.wiki/scripts/waitForKeyElements/waitForKeyElements.js
// ==/UserScript==

/*
 * Basics from global.js
 */
var d = $(document),
	url = $(location).attr('href');

// xc
function xc( t ) {
	console.log( t );
}
// urlPath
function urlPath(n) {
	return url.split('/')[n+2];
}
var domain = urlPath(0).replace(/.+\.(.+\.[a-z0-9]+)/gi, '$1'),
	subdomain = urlPath(0);

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
        if (win) win.focus();
    });
}


/*
 * css
 */
var css = '.mixesDBorange, .mixesDBorange * {color: #f60 !important} .center {text-align:center} .top5 {margin-top:5px} .mdb-fake-link{cursor:pointer}';
var cssBendodson = 'img.mdb-image.mdb-replaced {max-width: 100%}';
$("head").append('<style>'+ css + cssBendodson +'</style>');


/*
 * funcs
 */
// waiterFunc()
function waiterFunc(e) {
    setInterval(function() {
        if( typeof e !== "undefined" ) {
            if (e.css('visibility') == 'hidden') {
                e.css('visibility', 'visible');
            } else {
                e.css('visibility', 'hidden');
            }
        }
    }, 600);
}


/*
 * albumartexchange.com
 */
if( domain == "albumartexchange.com" ) {
    $("a.button.view-icon").attr("target","same");
}


/*
 * music.apple.com
 */
if( domain == "apple.com"
   && ( urlPath(1) == "album" || urlPath(2) == "album" || urlPath(1) == "playlist" || urlPath(2) == "playlist" )
  ) {
    xc("am here");
    // full artwork link
    waitForKeyElements('.native-upsell__button svg', amLargeArtwork);
    function amLargeArtwork(jNode) {
        var imgWrapper = $(".product-lockup__artwork"),
            img = $("source", imgWrapper),
            str = img.attr("srcset"),
            url = str.substr(0,str.indexOf(' '));
        url = url.substring(0, url.lastIndexOf('/')) + "/100000x100000-999.jpg";
        
        if( url && $("#mdbImgFull").length === 0 ) {
            imgWrapper.after('<p class="mdb-fake-link mdb-imgLarge-wrapper mixesDBorange" data-href="'+url+'" style="padding-top:15px; text-align:center">Full image (<span>...</span>)</p>');

            var imgLargeWrapper = $(".mdb-imgLarge-wrapper"),
                waiter = $("span",imgLargeWrapper);

            if( $("#mdb-artwork-size-info").length === 0 ) {
                waiterFunc( waiter );
            }
            $("body").append('<img id="mdbImgFull" src="'+url+'" style="display:none"/>');

            var imgThis = $("#mdbImgFull");

            imgThis.on('load', function(){
                console.log( "img loaded" );
                var imageWidth = imgThis.width(),
                    imageHeight = imgThis.height(),
                    imageType = url.replace(/^.+\.([a-z]{3})/, "$1").toUpperCase(),
                    sizeInfo = '<span id="mdb-artwork-size-info">'+imageWidth+' x '+imageHeight+' '+imageType+'</span>';

                waiter.replaceWith(sizeInfo);
            });
        }
        
        triggerFakeLinks();
    }
}


/*
 * bandcamp.com
 */
if( domain == "bandcamp.com" ) {
    var wrapper = $("#tralbumArt").add(".artcont");
    wrapper.each(function(){
        var img = $("img",this),
            url = img.attr("src").replace(/_\d+\.jpg$/g, "_0.jpg");
        img.attr("src",url)
           .wrap('<a href="'+url+'" target="_self"></a>');

        $("a.popupImage",this).click(function(e){
            window.location.href = url;
            e.stopImmediatePropagation();
        });
    });
}


/*
 * bendodson.com
 */
if( domain == "bendodson.com" ) {
    $("#wrapper").css({"padding":"0","margin":"0"});
    $("#entity option[value='album']").attr("selected","selected");
    $("#query").insertAfter("form .submit").css({"width":"100%", "font-size":"22px", "margin":"0 80px", "padding":"2px 5px", "font-family":"monospace"});
    $("article + article").add("footer").add("#thanks").add("#musictracker").remove();

    waitForKeyElements('#results h3', results);
    function results(jNode) {
        $("#results div").each(function() {

            var p = $("h3 + p", this),
                hiResSrc = $("a", p).eq(1).attr("href")
                             .replace(/http:\/\/is(\d+).mzstatic.com/, "https://is$1-ssl.mzstatic.com");
            //console.log( hiResSrc );

            if( hiResSrc ) {
                p.addClass("mixesDBorange").text("").append('<span>...</span>');
                waiterFunc( $("span",p) );

                $("a", this).attr("href", hiResSrc);
                $("a img", this).addClass("mdb-image").attr({"src":hiResSrc, "width":"", "height":""}).css({"padding":"0"});

                var img = $("a img", this);
                img.on('load', function(){
                    console.log( "img loaded" );
                    var imageWidth = img.width(),
                        imageHeight = img.height(),
                        imageType = hiResSrc.replace(/^.+\.([a-z]{3})/, "$1").toUpperCase(),
                        sizeInfo = imageWidth+' x '+imageHeight+' '+imageType;

                    $("span",p).remove();
                    p.replaceWith( '<div style="padding-bottom: 10px;" class="mixesDBorange"><a href="'+hiResSrc+'" target="_blank">'+sizeInfo+'</a></div>' );
                    $(this).addClass("mdb-replaced");
                });
            }
        });
    }
}


/*
 * Discogs
 */
if( domain == "discogs.com"
   && ( urlPath(1) == "release" || urlPath(2) == "release" || urlPath(3) == "release" || urlPath(2) == "master" || urlPath(3) == "master" )
  ) {
    xc( "discogs")
    // giant ad container after ad blocker
    $(".ad_container").closest(".section_content").remove();
    $(".ad_container").remove();
    $(".ads-ad").remove();

    // artwork sites link
    var urlTitle = urlPath(1); // not language path
    if( urlTitle.length < 5 ) urlTitle = urlPath(2);
    if( urlTitle.length > 4 ) {
        var query = $("head title").text()
                        .replace(/( EP)?( \(\d+, .+\))? [-|] Discogs/gi, "")
                        .replace(" – ", " ")
                        .replace(/[,&]/g, "")
                        .replace(/\s+/g, " "),
            queryE = query.replace(/ /gm,'%20'),
            url1 = 'https://bendodson.com/projects/itunes-artwork-finder/index.html?entity=album&query='+queryE+'&country=us',
            url2 = 'https://bandcamp.com/search?q='+queryE,
            url3 = 'https://albumartexchange.com/covers?fltr=ALL&sort=TITLE&status=&size=any&q='+queryE,
            url4 = 'https://www.google.com/search?q='+queryE+'&tbm=isch&tbs=isz%3Al&hl=de&ved=0CAEQpwVqFwoTCNC-jIqozOoCFQAAAAAdAAAAABAD&biw=2094&bih=1796',
            link = '<h2 class="mixesDBorange"><a style="padding-left:5px" class="mixesDBorange" href="https://www.mixes.wiki/tools/open/?urls='+encodeURIComponent(url1)+','+encodeURIComponent(url2)+','+encodeURIComponent(url3)+','+encodeURIComponent(url4)+'" target="_blank">Find artwork</a></h2>';
        setTimeout( function(){
            var target = $("#release-actions");
            if( target.length == 1 ) {
                target.prepend(link);
            } else {
                $("#page_aside").prepend(link);
            }
        }, 1000 );
        xc( query );
    } else {
        console.log( "No url title" );
    }
}


/*
 * hhv.de
 */
if( domain == "hhv.de" ) {
    /* Artowrk url small to original
     * https://i2.cdn.hhv.de/catalog/475x475/00599/599662.jpg
     * https://i2.cdn.hhv.de/catalog/shop_detail_zoom/00599/599662.jpg
     */
    waitForKeyElements('.items_detail .picture .main img', hhvArtwork);

    function hhvArtwork(jNode) {
        xc( "hhvArtwork()" );
        $("#mdbImgFull").remove();

        var img = jNode,
            url = img.attr("src").replace(/\/catalog\/\d+x\d+\//g, '/catalog/shop_detail_zoom/');

        $("body").append('<img id="mdbImgFull" src="'+url+'" style="display:none"/>');

        var imgThis = $("#mdbImgFull");

        imgThis.on('load', function(){
            console.log( "img loaded" );
            var imageWidth = imgThis.width(),
                imageHeight = imgThis.height(),
                imageType = url.replace(/^.+\.([a-z]{3})/, "$1").toUpperCase(),
                sizeInfo = imageWidth+' x '+imageHeight+' '+imageType,
                link = '<div id="mdb-imgSize" class="mixesDBorange center top5"><a href="'+url+'" target="_blank">'+sizeInfo+'</a></div>';

            $("#mdb-imgSize").remove();
            img.closest(".main").after(link);
        });
    }

    waitForKeyElements('.navigation .picture', hhvArtworkLinks);
    function hhvArtworkLinks(jNode) {
        jNode.on("click",function(e){
            $("#mdb-imgSize").text("…");

            var url = $("img",jNode).attr("src").replace(/\/catalog\/\d+x\d+\//g, '/catalog/shop_detail_zoom/');
            var img = $('.items_detail .picture .main img');
            img.attr("src",url);
            hhvArtwork( img );
        });
    }
}

