var searchPage = {
    batchSize: 20,
    endIndex: 0,
    query: null,
    //arrays to keep track the facet selection
    facetedkey: [],
    facetedvalue: [],

    init: function () {
        queryly.QuerylyKey = 'c99eafd2993b450c';

        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0].toLowerCase() == 'searchkey') {
                searchPage.query = sParameterName[1] + ' ';
                break;
            }
        }
        if (searchPage.query != '' && searchPage.query != null) {
            searchPage.dofacetedsearch(0, '', '');


        }
    },

    atiTrack: function (link) {
        

    },

    //This render the faceted object into html. In the current rss feed, creator and pubdate are used in the facet.
    renderFaceted: function (faceted) {
        var html = '<div style="margin-top:10px;" ><a style="cursor:pointer" onclick="searchPage.dofacetedsearch(0,\'\',\'\');return false;">Clear All</a></div><div style="margin-top:10px;margin-bottom:10px;background:black;color:white;padding:6px;" >Filter by Author</div>';

        //build the filters for creator field
        var creators = faceted.creator;
        for (var i = 0; i < creators.length; i++) {
            html = html + '<div><a style="cursor:pointer" onclick="searchPage.dofacetedsearch(0,\'creator\',\'' + creators[i].key.replace(/'/g, "\\'") + '\')";return false;">' + creators[i].key + ' (' + creators[i].value + ')</a></div>';
        }
               

       

        html = html + '<div style="margin-top:10px;margin-bottom:10px;background:black;color:white;padding:6px;" >Filter by Date</div>';
        //build the filters for publication date, data are grouped into buckets. for example, 168 means "published in the past 168 hours"
        var dates = faceted.pubDate;
        for (var i = 0; i < dates.length; i++) {
            var datename = '';
            if (dates[i].key == '24') {
                datename = "within 24 hours";
            }
            else if (dates[i].key == '168') {
                datename = "within one week";
            }
            else if (dates[i].key == '720') {
                datename = "within 30 days";
            }
            else if (dates[i].key == '8760') {
                datename = "within a year";
            }
            else if (dates[i].key == '26280') {
                datename = "within three years";
            }
            if (datename != '') {
                html = html + '<div><a style="cursor:pointer;" onclick="searchPage.dofacetedsearch(0,\'pubDate\',\'' + encodeURIComponent(dates[i].key) + '\')";return false;">' + datename + ' (' + dates[i].value + ')</a></div>';
            }
        }

        document.getElementById('faceteddata').innerHTML = ("<div style='font-family:CentraNo1Book'>" + html + "</div>");
    },

    redirectsearch: function () {
        if (document.getElementById('advanced_searchbox').value != '') {
            window.location = "/search?searchkey=" + document.getElementById('advanced_searchbox').value;
        }
        
    },

    advanced_searchbox_keydown: function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode == 13) {
            searchPage.redirectsearch();
        }
    },

    resultcallback: function (results) {
        //retrieve metadata
        var total = results.metadata.total;
        searchPage.endIndex = results.metadata.endindex;



        //if there is faceted data in results object, render it.
        if (results.faceted != null && results.faceted != undefined) {
            this.renderFaceted(results.faceted);
        }

        var elem = document.createElement("div");
        var html = "<style>.searchresultlabel {font-size:25px;} #faceteddata {width:220px;overflow:hidden;font-size:15px;} .queryly_item_title {margin-top:3px;font-family:GrifitoM;font-size:1.9375rem;line-height:1.625rem;} @media (max-width: 500px) {.searchresultlabel {margin-right:150px;} #advanced_searchbox {margin-left:0px!important;}} @media (max-width: 880px) {.searchresultlabel {font-size:15px;} .search {margin-top:15px;} #resultdata {margin-left:10px;margin-right:10px} .queryly_item_title {margin-top:3px;font-family: CentraNo1;font-size: 16px;line-height: 17px; }} </style><div style='margin-bottom: 12px;padding-bottom:10px;'><div style='margin-bottom: 15px;margin-left:10px;'><span class='searchresultlabel' style='font-weight:400;font-family:CentraNo1Book;color:#939598'>Search results for</span> <b style='color:black'><input id='advanced_searchbox' style='margin-left:15px;min-width:200px;vertical-align:initial;border:1px solid #ccc;font-size:28px;padding:4px;width:calc(100% - 350px);font-family:CentraNo1' type='textbox' value='" + results.metadata.query + "' /></b>";
        html = html + "<a style='text-decoration:none;display:inline-block;vertical-align:bottom;padding:8px;margin-left:15px;' onclick='searchPage.redirectsearch();return false;' href='#'><div style='background-color: #22458F;border-radius: 3px;color: #fff;font-family: CentraNo1;font-size: .875rem; font-weight: 700;letter-spacing: 1.4px;padding: 0 7px 3px 8px;text-transform: uppercase;text-align: center;height: 27px;height: 1.5625rem;padding: .29688rem .4375rem .4375rem .5rem;margin-top: -.3125rem;'>SEARCH</div></a></div>";
        elem.innerHTML = html;
        document.getElementById('resultdata').appendChild(elem);

        //document.getElementById('resultdata').appendChild("<div style='margin-bottom: 12px; border-bottom: 1px solid #ccc;padding-bottom:10px;'><span style='font-size:28px;font-family:KlavikaBlack, Titillium, Arial, sans-serif;color:#777'>Search results for <b style='color:black'><input id='advanced_searchbox' style='font-size:28px;font-family:KlavikaBlack, Titillium, Arial, sans-serif;padding:4px;width:200px;' type='textbox' value='" + results.metadata.query + "' /><input style='margin-left:10px;font-size:28px;padding:4px;cursor:pointer;font-family:KlavikaBlack, Titillium, Arial, sans-serif'  type='button' value='Search' onclick='searchPage.redirectsearch();'></b></div>");

        //queryly.jquery('#advanced_searchbox').keydown(function (e) {
            document.getElementById('advanced_searchbox').addEventListener("keydown",function (e) {
            var keyCode = e.keyCode || e.which;
           if (keyCode == 13) {
               searchPage.redirectsearch();
            }
        });
 
        //loop through each result.
        for (var i = 0; i < results.items.length; i++) {
            //display search native ad if available
            if (results.ads != null && results.ads.length > 0) {
                for (var j = 0; j < results.ads.length; j++) {
                    if (results.ads[j].index == i) {
                        //queryly.jquery('#resultdata').append(searchPage.renderitem(results.ads[j]));
                        html = html + searchPage.renderitem(results.ads[j]);
                        break;
                    }
                }
            }

            var item = results.items[i];
            var html = html + searchPage.renderitem(item);
            //document.getElementById('resultdata').innerHTML = html;
            //queryly.jquery('#resultdata').append(html);
        }

        //var pagerhtml = '';
        if (total > searchPage.endIndex) {
            html = html + '<a style="float:right;text-decoration:none;margin:10px;" onclick="searchPage.turnpage(' + searchPage.endIndex + ');return false;" href="#"><div style="background-color: #22458F;border-radius: 3px;color: #fff;font-family: CentraNo1;font-weight: bold;font-size: 14px; line-height: 14px; letter-spacing: 1.4px;padding: 0 7px 3px 8px;text-transform: uppercase;text-align: center;height: 27px;height: 1.5625rem;padding: .29688rem .4375rem .4375rem .5rem;margin-top: -.3125rem;">NEXT</div></a>';
        }
        if (searchPage.endIndex > searchPage.batchSize) {
            var prev = Math.max(0, searchPage.endIndex - 2 * searchPage.batchSize);
            html = html + '<a style="float:left;text-decoration:none;margin:10px;" onclick="searchPage.turnpage(' + prev + ');return false;" href="#" ><div style="background-color: #22458F;border-radius: 3px;color: #fff;font-family: CentraNo1;font-weight: bold;font-size: 14px; line-height: 14px; letter-spacing: 1.4px;padding: 0 7px 3px 8px;text-transform: uppercase;text-align: center;height: 27px;height: 1.5625rem;padding: .29688rem .4375rem .4375rem .5rem;margin-top: -.3125rem;">PREV</div></a>';
        }
        document.getElementById('resultdata').innerHTML = html;
        window.scrollTo(0, 0);
        //queryly.jquery('#resultdata').append(pagerhtml);
        //queryly.jquery(document).scrollTop();


    },
    renderitem: function (item) {
        item.link = item.link + "?cid=search";
        var trackcall = 'onmousedown = "queryly.util.trackClick(\'' + item.link + '\',\'' + searchPage.query + '\');"';
        if (item.isad == 1) {
            trackcall = 'onmousedown = "queryly.util.trackAdClick(' + item._id + ')"';
        }

        var html = '<div class="queryly_item_row" style="position:relative;overflow:hidden;margin-bottom:10px;font-size:10px;border-bottom:1px solid #eee;padding-bottom:12px;padding-left:5px;width:100%;"><a ' + trackcall + ' href="' + item.link + '" style="text-decoration:none;color:#111">';
        if (item.image != '') {
	        if (item.image.indexOf('incthumb') > 0){
		    html = html + '<div style="max-height:100px; overflow:hidden;float:left;"><img style="padding:6px;padding-right:12px;float:left;margin-top:-60px;" onerror="this.parentNode.removeChild(this);" src="' + item.image + '" /></div>';
	        }
	        else {
		    html = html + '<img style="padding:6px;padding-right:12px;float:left" onerror="this.parentNode.removeChild(this);" src="' + item.image + '" />';
	        }
        }

        try {
            if (typeof item.brand != "undefined" && item.brand != "") {
                html = html + '<div style="font-weight:bold;text-align:left;font-size:16px;"><span style="color:#009CD8">' + item.brand + '</span>View</div>';
            }
        }
        catch (e) { }

        html = html + '<div style="margin-top:0px;"><div class="queryly_item_title">';

        if (item.isad == 1) {
            html = html + "<div style='background: #98a9d5;padding:3px;font-size:12px;color: white;margin-left:10px;'>SPONSORED CONTENT</div>" + item.title + "</div></div>";
        }
        else {
            html = html + item.title + '</div></div>';
        }
        
        

        html = html + '<div  class="queryly_item_description" style="font-family:CentraNo1Book;font-size:15px; line-height:17px;">' + item.description.replace("\"", "").replace("'", "").replace(/(([^\s]+\s\s*){24})(.*)/, "$1...") + '</div>';
        html = html + '</a></div>';
        return html;
    },

    turnpage: function (index) {
       // queryly.jquery('#resultdata').html('');
        document.getElementById('resultdata').innerHTML = '';

        var keys = '';
        var values = ''
        for (var i = 0; i < searchPage.facetedkey.length; i++) {
            keys = keys + searchPage.facetedkey[i] + "|";
            values = values + searchPage.facetedvalue[i] + "|";
        }
        var url = queryly.protocol + "api.queryly.com/json.aspx?queryly_key=" + queryly.QuerylyKey + "&query=" + searchPage.query + "&endindex=" + index + "&batchsize=" + searchPage.batchSize + "&callback=searchPage.resultcallback&showfaceted=true&extendeddatafields=brand&timezoneoffset=" + (new Date(0)).getTimezoneOffset();

        if (searchPage.facetedkey.length > 0) {
            url = url + "&facetedkey=" + encodeURIComponent(keys) + "&facetedvalue=" + encodeURIComponent(values);
        }

        //making the search call to Queryly server
        searchPage.loadScript(url, function (data, textStatus, jqxhr) {
            window.scrollTo(0, 0);
        });


    },


    //similar with dosearch method, but with faceted turned on. It passes in the current facet selection if any.
    dofacetedsearch: function (index, key, value) {
        //queryly.jquery('#resultdata').html('');
        document.getElementById('resultdata').innerHTML = '';

        //assemble the rest api.
        var url = queryly.protocol + "api.queryly.com/json.aspx?queryly_key=" + queryly.QuerylyKey + "&query=" + searchPage.query + "&endindex=" + index + "&batchsize=" + searchPage.batchSize + "&callback=searchPage.resultcallback&showfaceted=true&extendeddatafields=brand&timezoneoffset=" + (new Date(0)).getTimezoneOffset();

        if (key != '') {
            if (searchPage.facetedkey.indexOf(key) >= 0) {
                var i = searchPage.facetedkey.indexOf(key);
                searchPage.facetedvalue[i] = value;
            }
            else {
                searchPage.facetedkey.push(key);
                searchPage.facetedvalue.push(value);
            }

            var keys = '';
            var values = ''
            for (var i = 0; i < searchPage.facetedkey.length; i++) {
                keys = keys + searchPage.facetedkey[i] + "|";
                values = values + searchPage.facetedvalue[i] + "|";
            }

            url = url + "&facetedkey=" + encodeURIComponent(keys) + "&facetedvalue=" + encodeURIComponent(values);
        }
        else {
            searchPage.facetedkey = [];
            searchPage.facetedvalue = [];
        }

        //making the search call to Queryly server
        searchPage.loadScript(url, function (data, textStatus, jqxhr) {
            window.scrollTo(0, 0);
        });
    },

    loadScript: function (src, callback) {
        var script = document.createElement('script');
        var loaded = false;
        script.setAttribute('src', src);
        if (callback) {
            script.onreadystatechange = script.onload = function () {
                if (!loaded) {
                    callback();
                }
                loaded = true;
            };
        }
        document.head.appendChild(script);
    }
}
searchPage.init();
