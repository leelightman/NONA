var queryly = {};
(function (window) {
    queryly = {
        QuerylyKey: '',
        pageurl: '',
        urlOverwrite: '',
        timer: null,
        unseenads: [],
        searchbox: null,
        suggestbox: null,
        resultcontainer: null,
        basecontainer: null,
        innercontainer: null,
        initialized: 0,
        isdraft: 0,
        extendedDataFields: '',
        currentItemIndex: 0,
        visitorid: '',
        waitForReturn: false,
        searchredirect: '',

        endIndex: 0,
        total: 0,
        batchSize: 10,
        currentQuery: '',
        previousQuery: '',
        guess: '',
        currentGuess: '',

        splash: [],
        enableSplash: false,
        enableRelatedSearch: false,
        relatedCount: 6,
        protocol: ('https:' == document.location.protocol ? 'https://' : 'http://'),
        groups: [],
        partners: '',
        searchAPIServer: '//api.queryly.com',
        preload: false,

        init: function (querylykey, searchbutton, endpoint) {

            if (typeof endpoint != "undefined" && typeof endpoint.searchAPIServer != "undefined" && endpoint.searchAPIServer != "") {
                queryly.searchAPIServer = endpoint.searchAPIServer;
            }

            queryly.QuerylyKey = querylykey;
            queryly.pageurl = document.URL.toLowerCase();
            queryly.layout.init();

            if (searchbutton != null) {
                for (var i = 0; i < searchbutton.length; i++) {
                    searchbutton[i].addEventListener("click", function () {
                        if (queryly.initialized == 0) {
                            queryly.initCall();
                        }
                        else {
                            queryly.opensearch();
                        }
                    });
                }
               
            }

            document.getElementById('queryly_closebutton').addEventListener("click", function () {
                queryly.closesearch();
            });

            queryly.searchbox.addEventListener("keyup", function (event) {
                switch (event.keyCode) {
                    case 37: return;
                    case 38: return;
                    case 39: return;
                    case 40: return;
                }

                clearTimeout(queryly.timer);
                queryly.waitForReturn = false;

                if (queryly.searchbox.value == '') {
                    queryly.reset();
                    return;
                }
                else {
                    var fsuggest = queryly.util.getFullSuggestion().toLowerCase();
                    if (fsuggest == '' || fsuggest.indexOf(queryly.currentQuery.toLowerCase()) != 0) {
                        queryly.currentItemIndex = 0;
                        queryly.timer = setTimeout("queryly.dosearch(0);", 300);
                    }
                }
            });

            queryly.searchbox.addEventListener("keydown", function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 9) {
                    e.preventDefault();
                    queryly.util.autoFillSuggestion();
                }
                else if (keyCode == 32) {
                    queryly.guess = "";
                }
                else if (keyCode == 13) {
                    if (queryly.searchredirect != '') {
                        window.location = queryly.searchredirect;
                    }

                }
            });

            try {
                if (queryly.urlOverwrite != '' && queryly.urlOverwrite != null) {
                    queryly.pageurl = queryly.urlOverwrite.toLowerCase();
                }
            }
            catch (e) { }

            if (queryly.preload) {
                queryly.initCall();
            }
        },

        initCall: function () {
            queryly.visitorid = queryly.util.getVisitorID();
            var apiurl = queryly.searchAPIServer + '/search3.aspx?&queryly_key=' + queryly.QuerylyKey + '&initialized=0&isdraft=' + queryly.isdraft + '&pageurl=' + encodeURIComponent(queryly.pageurl.replace(/&amp;/g, "&")) + '&random=' + Math.random() + '&timezoneoffset=' + (new Date(0)).getTimezoneOffset() + '&visitorid=' + queryly.visitorid;
            var querylydemo = queryly.util.getUrlParameter('querylydemo');
            if (querylydemo != null && querylydemo != '' & querylydemo != 'null') {
                apiurl = apiurl + '&querylydemo=' + querylydemo;
            }

            queryly.util.loadScript(apiurl, function (data, textStatus, jqxhr) {
            });
        },

        track: function () {
            if ((queryly.guess != '' && queryly.guess != queryly.currentGuess) || queryly.total == 0) {
                try {
                    var trackurl = "//data.queryly.com/track.aspx?queryly_key=" + queryly.QuerylyKey + "&visitorid=" + queryly.visitorid + "&query=" + encodeURIComponent(queryly.currentQuery) + "&suggest=" + encodeURIComponent(queryly.guess) + "&total=" + queryly.total + "&target=&source=";
                    new Image().src = trackurl;
                }
                catch (e) { }
                queryly.currentGuess = queryly.guess;
            }
        },

        trackad: function (off, containerheight) {
            try {
                for (var i = 0; i < queryly.unseenads.length; i++) {
                    if (!queryly.unseenads[i].isseen) {
                        var range = queryly.unseenads[i].top + off;
                        if (range > -20 && range < containerheight) {
                            queryly.unseenads[i].isseen = true;
                            new Image().src = "//data.queryly.com/track.aspx?queryly_key=" + queryly.QuerylyKey + "&tracktype=campaign&visitorid=" + queryly.util.getVisitorID() + "&allocationid=" + queryly.unseenads[i].id + "&pageurl=";
                        }
                    }
                }
            }
            catch (e) { }
        },

        dosearch: function (scrollSearch) {
            queryly.currentQuery = queryly.searchbox.value;
            if (scrollSearch == 0) {
                queryly.endIndex = 0;
            }
            var apiurl = queryly.searchAPIServer + '/search3.aspx?query=' + encodeURIComponent(queryly.searchbox.value) + '&queryly_key=' + queryly.QuerylyKey + '&initialized=' + queryly.initialized + '&scrollsearch=' + scrollSearch + '&isdraft=' + queryly.isdraft + '&batchsize=' + queryly.batchSize + '&endindex=' + queryly.endIndex + '&url=' + encodeURIComponent(queryly.pageurl.replace(/&amp;/g, "&")) + '&extendeddatafields=' + queryly.extendedDataFields + '&random=' + Math.random() + '&timezoneoffset=' + (new Date(0)).getTimezoneOffset();

            if (queryly.enableRelatedSearch) {
                apiurl = apiurl + '&relatedcount=' + queryly.relatedCount;
            }

            if (queryly.groups.length > 0) {
                apiurl = apiurl + '&groups=' + queryly.groups.toString();
            }

            if (queryly.partners != '') {
                apiurl = apiurl + '&partners=' + queryly.partners;
            }

            queryly.util.loadScript(apiurl, function () {
                queryly.waitForReturn = false;
            });
        },

        opensearch: function () {
            if (queryly.initialized == 0) {
                queryly.initCall();
                return;
            }
            document.getElementById('queryly_innercontainer').style.display = "none";
            document.getElementById('queryly_basecontainer').style.display = "";
            document.getElementById('queryly_innercontainer').style.display = "";
            //queryly.util.slideToggle(document.getElementById('queryly_innercontainer'));

            queryly.searchbox.focus();
            if (document.body.classList) {
                document.body.classList.add('queryly_searchplus_visible')
            }
            else {
                document.body.className += ' queryly_searchplus_visible';
            }
            if (document.getElementsByTagName('html')[0].classList) {
                document.getElementsByTagName('html')[0].classList.add('queryly_searchplus_visible')
            }
            else {
                document.getElementsByTagName('html')[0].className += ' queryly_searchplus_visible';
            }


            if (navigator.userAgent.match(/iphone|ipad/i)) {
                if (document.body.classList) {
                    document.body.classList.add('queryly_searchplus_visible_iosfix')
                }
                else {
                    document.body.className += ' queryly_searchplus_visible_iosfix';
                }

                if (document.getElementsByTagName('html')[0].classList) {
                    document.getElementsByTagName('html')[0].classList.add('queryly_searchplus_visible_iosfix')
                }
                else {
                    document.getElementsByTagName('html')[0].className += ' queryly_searchplus_visible_iosfix';
                }
            }
            queryly.showsplash();
        },

        showsplash: function () {
            try {

                if (queryly.enableSplash && typeof queryly.splash.items != 'undefined' && queryly.splash.items.length > 0) {
                    var splashhtml = '';
                    if (document.querySelectorAll('#queryly_splash_template').length == 1) {
                        for (var querylyitemcount = 0; querylyitemcount < queryly.splash.items.length; querylyitemcount++) {
                            queryly.data = queryly.splash.items[querylyitemcount];
                            splashhtml = splashhtml + queryly.render.tmpl('queryly_splash_template', new Object());
                        }
                    }
                    if (splashhtml != '') {
                        var itemhtml = queryly.render.tmpl('queryly_splashheader_template', new Object());
                        splashhtml = itemhtml + splashhtml;
                        var elem = document.createElement("div");
                        elem.innerHTML = splashhtml;
                        document.getElementById('queryly_resultcontainer').appendChild(elem);                       
                    }
                }
            }
            catch (e) { }
        },


        dorelated: function (related) {
            var keyword = related.innerText + " ";
            queryly.reset();
            queryly.searchbox.value = keyword;
            queryly.dosearch(0);
        },

        reset: function () {
            queryly.searchbox.value = '';
            queryly.suggestbox.value = '';
            document.getElementById('queryly_resultcontainer').innerHTML = '';

            queryly.endIndex = 0;
            queryly.total = 0;
            queryly.currentItemIndex = 0;

            queryly.currentQuery = '';
            queryly.previousQuery = '';
            queryly.guess = '';
            queryly.currentGuess = '';
            queryly.unseenads = [];
        },

        closesearch: function () {
            setTimeout(function () {
                document.getElementById('queryly_basecontainer').style.display = 'none';
            }, 300);


            if (document.body.classList) {
                document.body.classList.remove('queryly_searchplus_visible');
            }
            else {
                document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'queryly_searchplus_visible'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }

            if (document.getElementsByTagName('html')[0].classList) {
                document.getElementsByTagName('html')[0].classList.remove('queryly_searchplus_visible');
            }
            else {
                document.getElementsByTagName('html')[0].className = document.getElementsByTagName('html')[0].className.replace(new RegExp('(^|\\b)' + 'queryly_searchplus_visible'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }


            if (navigator.userAgent.match(/iphone|ipad/i)) {

                if (document.body.classList.classList) {
                    document.body.classList.remove('queryly_searchplus_visible_iosfix');
                }
                else {
                    document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'queryly_searchplus_visible_iosfix'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                }

                if (document.getElementsByTagName('html')[0].classList) {
                    document.getElementsByTagName('html')[0].classList.remove('queryly_searchplus_visible_iosfix');
                }
                else {
                    document.getElementsByTagName('html')[0].className = document.getElementsByTagName('html')[0].className.replace(new RegExp('(^|\\b)' + 'queryly_searchplus_visible_iosfix'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                }
            }
            queryly.reset();
        }
    };

    queryly.layout = {
        basecontainer: '<div style="display:none;position: fixed; top: 0px; left: 0px; right: 0px; bottom: 0px; z-index: 2147483647;background-color: rgba(0, 0, 0, 0.498039);" id="queryly_basecontainer"><div id="queryly_innercontainer" style="line-height:1;position: relative; margin: auto; text-align: left; height: calc(100% - 40px); width: 86%; max-width:1024px; background: white; top: 20px; left: 0; right: 0; bottom: 0; padding: 0px;overflow-y: auto;overflow-x:hidden;"><table id="queryly_innetable" style="width: 86%;max-width:1024px;position:fixed;top:20px;box-shadow:none;z-index:999;display:inline-table;" cellpadding="0" cellspacing="0"><tbody><tr><td style="width: 100%; position: relative;border:0px;padding:0px;border-bottom: 1px solid #ccc;"><img id="queryly_closebutton" style="width: 36px;position: absolute;right: 2px;z-index: 9999999;padding: 2px;vertical-align: bottom;float: right;cursor:pointer;background:white;" src="//www.queryly.com/images/close.png"><input type="text" style="position: absolute; margin: 0px; padding: 9px; font-size: 20px;border: none; border-bottom: 1px solid transparent; width: 100%; box-sizing: border-box;-moz-box-sizing: border-box; -webkit-box-sizing: border-box;height:initial;outline:none;" id="queryly_suggest" class="queryly_suggest" autocorrect="off" autocapitalize="off" autocomplete="off"><input class="queryly" placeholder="Search latest news ..." style="position: relative;margin: 0px; padding: 9px; font-size: 20px; opacity: 0.7; border: none; border-bottom: 1px solid transparent;background: white none repeat scroll 0% 0%; width: 100%; box-sizing: border-box;-moz-box-sizing: border-box; -webkit-box-sizing: border-box;height:initial;outline:none;" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false"></td></tr></tbody></table><table style="width: 100%;border:0px;" cellpadding="0" cellspacing="0"><tbody><tr><td style="vertical-align: top;"><div style="padding-top:55px;line-height:1.2;" id="queryly_resultcontainer" /></td></tr></tbody></table></div></div>',
        init: function () {
            var elem = document.createElement("div");
            elem.innerHTML = queryly.layout.basecontainer;
            document.body.prepend(elem);
            queryly.searchbox = document.getElementsByClassName('queryly')[0];
            queryly.suggestbox = document.getElementsByClassName('queryly_suggest')[0];
            queryly.resultcontainer = document.getElementById('queryly_resultcontainer');
            queryly.basecontainer = document.getElementById('queryly_basecontainer');
            queryly.innercontainer = document.getElementById('queryly_innercontainer');

            ("mousewheel DOMMouseScroll touchmove".split(" ")).forEach(function (e) {
                queryly.resultcontainer.addEventListener(e, function (event) {
                    if (queryly.currentQuery == '') {
                        return;
                    }
                    if (event.wheelDelta > 0 || event.detail < 0) {

                    }
                    else {
                        if (queryly.endIndex >= queryly.total) {
                            if (document.getElementById('queryly_endofresults').length == 0) {
                                queryly.resultcontainer.appendChild('<center><div id="queryly_endofresults" style="border-top: 1px solid #ddd;margin: 30px;width: 50%;margin-bottom: 18px;"><div style="display: inline-block;padding-left: 16px;padding-right: 16px;background: white;position: relative; top: -12px;font-weight: bold;color: #444;">End of Results</div></div></center>');
                            }
                            return;
                        }
                        var totalheight = queryly.resultcontainer.offsetHeight;
                        var off = queryly.resultcontainer.getBoundingClientRect().top;
                        var innercontainerheight = queryly.innercontainer.offsetHeight;
                        var delta = totalheight + off - innercontainerheight;
                        if (delta < 200) {
                            if (!queryly.waitForReturn) {
                                queryly.waitForReturn = true;
                                try {
                                    queryly.dosearch(1);
                                }
                                catch (ex) { queryly.waitForReturn = false; }
                            }
                        }

                        if (queryly.unseenads.length > 0) {
                            queryly.trackad(off, innercontainerheight);
                        }
                    }
                }, false);
            });
        }
    };

    queryly.render = {
        cache: {},

        addHtmlBlock: function (html) {
            queryly.resultcontainer.appendChild(html);
        },

        addBlock: function (itemhtml, isad, id, skipIndxIncrement) {
            queryly.resultcontainer.appendChild(itemhtml);
            if (skipIndxIncrement != true) {
                queryly.currentItemIndex = queryly.currentItemIndex + 1;
            }
            queryly.render.hookEvent(itemhtml.querySelectorAll("a"), isad, id);

        },

        tmpl: function (str, data) {
            var fn = !/\W/.test(str) ?
          this.cache[str] = this.cache[str] ||
            this.tmpl(document.getElementById(str).innerHTML) :

            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
          new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +
            str.replace(/[\r\t\n]/g, " ")
               .replace(/'(?=[^%]*%>)/g, "\t")
               .split("'").join("\\'")
               .split("\t").join("'")
               .replace(/<%=(.+?)%>/g, "',$1,'")
               .split("<%").join("');")
               .split("%>").join("p.push('")
               + "');}return p.join('');");

            // Provide some basic currying to the user
            return data ? fn(data) : fn;
        },

        hookEvent: function (links, isad, id) {
            links.forEach(function (e) {
                e.addEventListener("mousedown", function () {
                    try {
                        //var adparam = "";
                        if (isad == 1) {
                            new Image().src = "//data.queryly.com/track.aspx?queryly_key=" + queryly.QuerylyKey + "&tracktype=campaign&visitorid=" + queryly.util.getVisitorID() + "&clicked=1&allocationid=" + id + "&pageurl=";
                        }
                        else {
                            new Image().src = "//data.queryly.com/track.aspx?queryly_key=" + queryly.QuerylyKey + "&visitorid=" + queryly.util.getVisitorID() + "&query=" + escape(queryly.currentQuery) + "&suggest=" + escape(queryly.guess) + "&total=" + queryly.total + "&source=&target=" + encodeURIComponent(this.href.replace(/&amp;/g, "&"));
                        }

                        if (typeof (queryly.callback.clickCallback) != 'undefined' && queryly.callback.clickCallback) {
                            try {
                                var header_fullsuggest = queryly.util.getFullSuggestion();
                                if (header_fullsuggest == '') {
                                    header_fullsuggest = queryly.searchbox.value;
                                }
                                queryly.callback.clickCallback(link, header_fullsuggest);
                            }
                            catch (e) { }

                        }
                    }
                    catch (e) { }
                });
            });
        },


    };

    queryly.command = {

        search: function (keyword) {
            queryly.reset();
            if (typeof keyword != 'undefined' && keyword) {
                queryly.searchbox.value = keyword;
            }
            else {
                queryly.searchbox.value = '';
            }
            queryly.dosearch(0);
        }

    };

    queryly.callback = {};

    queryly.related = {};

    queryly.campaign = {};

    queryly.util = {
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
        },

        imageShift: function (img) {
            if (img.naturalHeight > img.naturalWidth * 1.2) {
                var shift = -(img.naturalHeight - img.naturalWidth) / 2;
                (img).style.marginTop = shift + 'px';
            }
        },

        imageLoad: function (img, w, h) {
            if (img.naturalWidth < 20) {
                queryly.util.removeNode(img.parentNode);
            }
        },

        removeNode: function (node) {
            if (node != null && node.parentNode != null) {
                try {
                    node.parentNode.removeChild(node);
                }
                catch (e) { }
            }
        },

        imageError: function (img) {
            img.src = '//www.queryly.com/images/blank.png';
        },

        getUrlParameter: function (name) {
            return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
        },

        getCookie: function (name) {
            try {
                name = name + "=";
                var carray = document.cookie.split(';');

                for (var i = 0; i < carray.length; i++) {
                    var c = carray[i];
                    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
                }
            }
            catch (ex) {
                return null;
            }
            return null;
        },

        setCookie: function (name, value, days) {
            if (days == undefined) {
                days = 90;
            }
            if (value == 0) {
                document.cookie = name + '=' + value + '; path=/';
            }
            else {
                document.cookie = name + '=' + value + ';expires=' + new Date((new Date().getTime() + 1000 * 24 * 3600 * days)) + '; path=/';
            }
        },

        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        getVisitorID: function () {
            var id = queryly.util.getCookie("querylyvid");
            if (id == null) {
                id = queryly.util.getRandomInt(1, 2147483647);
                queryly.util.setCookie("querylyvid", id);
            }
            return id;
        },

        showSuggestion: function (guess) {

            if (queryly.currentQuery.length > 0) {
                var lastchar = queryly.currentQuery.charAt(queryly.currentQuery.length - 1);
                var lastword = queryly.util.getLastWord(queryly.currentQuery);
                var partialword = guess.substring(lastword.length);
                if (lastchar != ' ' && queryly.guess.substring(0, lastword.length) == lastword.toLowerCase()) {
                    queryly.suggestbox.value = (queryly.currentQuery + partialword);
                }
                else {
                    queryly.suggestbox.value = (queryly.currentQuery);
                }
            }

        },

        getLastWord: function (o) {
            return ("" + o).replace(/[\s]+$/, '').split(/[\s]/).pop();
        },


        getFullSuggestion: function () {
            var result = '';
            if (queryly.guess != '') {
                var q = queryly.searchbox.value;
                if (q.length > 0) {
                    var lastchar = q.charAt(q.length - 1);
                    var lastword = this.getLastWord(q);
                    var partialword = queryly.guess.substring(lastword.length);
                    if (lastchar != ' ' && queryly.guess.substring(0, lastword.length) == lastword.toLowerCase()) {
                        result = q + partialword;
                    }
                }
            }
            return result;
        },

        autoFillSuggestion: function () {
            var result = queryly.util.getFullSuggestion();
            if (result != '') {
                queryly.searchbox.value = (result);
            }
        },

        trackClick: function (url, q) {
            new Image().src = "//data.queryly.com/track.aspx?queryly_key=" + queryly.QuerylyKey + "&visitorid=" + queryly.util.getVisitorID() + "&query=" + q + "&suggest=" + q + "&total=10&source=&target=" + encodeURIComponent(url);
        },

        trackAdClick: function (id) {
            new Image().src = "//data.queryly.com/track.aspx?queryly_key=" + queryly.QuerylyKey + "&tracktype=campaign&visitorid=" + queryly.util.getVisitorID() + "&clicked=1&allocationid=" + id + "&pageurl=";
        },

        trackSearch: function (q) {
            new Image().src = "//data.queryly.com/track.aspx?queryly_key=" + queryly.QuerylyKey + "&visitorid=" + queryly.util.getVisitorID() + "&query=" + q + "&suggest=" + q + "&total=10&source=&target=";
        }

    };
})(window);
