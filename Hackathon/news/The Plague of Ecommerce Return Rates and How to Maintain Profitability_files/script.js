if (typeof InffuseWelcomebar != 'undefined') {
	function initScript(Inffuse){
		// var widget_url = "https://herowelcomebar.appspot.com/widget.html";

		var params = {
		'inffuse-platform': 'custom',
		'inffuse-user': Inffuse.user.key(),
		'inffuse-site': Inffuse.site.key(),
		'inffuse-project': Inffuse.project.key()
		}

		params = Object.keys(params).map(function(key){ 
			return encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
		}).join('&').replace(/%20/g,"+");

		var widget_url = 'https://herowelcomebar.appspot.com/widget.html?' + params;
			
		var heightSettings = '50px';
		var size = Inffuse.project.get('Size',"Regular");
		if (size == 'Small') {
			heightSettings = '30px'
		}

		var bar = jQuery('<div id="promotion-bar"></div>');
		bar.css({
			'position': 'fixed',
			left: 0,
			right: 0,
			height: heightSettings,
			'z-index': 99999,
			display: 'none',
			"margin-top": "-"+heightSettings
		});

		var isiPad = navigator.userAgent.match(/iPad/i);
        if (isiPad) {
				bar.css("margin-top","-70px")
	        }

		var position = Inffuse.project.get("position","top");
		var plan = getPlan(); 
		if (plan == "free") {
			position = "top";
		}

		bar.css(position,0);
		bar.css("margin-bottom","-"+heightSettings)

		bar.append('<iframe width="100%" height="100%" style="height: 100% !important" frameborder="0" src="'+widget_url+'"></iframe>');

		function getPlan() {
	
			var Timestamp = 1*(new Date());
			var plan = Inffuse.user.plan();
			var firstInstall = Inffuse.project.get("Installdate");
			var trialPeriod = 604800000; //7 days
		    var beeketing = Inffuse.project.get("beeketing", false);
		    if (beeketing) {
		        trialPeriod = 7776000000 ;
		    }

			if (plan == "free") {

				if (firstInstall == undefined) {		
				plan = "trial"
				} 

				else if ( (Timestamp-firstInstall) < trialPeriod) {
				plan = "trial"
				}

			}
	
			return plan;
		}

		
		var sessionSettings = Inffuse.project.get("sessionLimit",false);
		var newSession = sessionStorage.getItem("view");
		if (newSession && sessionSettings && (plan != "free"))
			return;

		var collectedEmail = sessionStorage.getItem("collectedEmail");
		if (collectedEmail)
			return;

		var Hide = Inffuse.project.get("Hide","false");
		if (Hide == "true")
			return;
		var specificURL = Inffuse.project.get('pageLimit', false);
		var limitURL = Inffuse.project.get('urllimit',{urllimit_1:"", urllimit_2:"", urllimit_3:""});
		var currentPage = window.location.href;
		currentPage = currentPage.replace(/.*?:\/\//g, "").replace(/\/$/, "");
		if (specificURL && currentPage != limitURL.urllimit_1 && currentPage != limitURL.urllimit_2 && currentPage != limitURL.urllimit_3 && plan != "free")
			return;

		var mobileEnable = (Inffuse.project.get("mobileEnable","true") == "true");

		function mobile() {
   		    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        		return true
       		}
   			
   			return false
		}

		var isMobile = mobile();
		if (isMobile && !mobileEnable)
			return;
		
		
		jQuery('body').append(bar);
		var timer = Inffuse.project.get("timer","0");
		if (plan == "free") {
			timer = 0; 
		}
		
		Inffuse.on("loaded",function(){
				setTimeout(function() {
					jQuery('#promotion-bar').css('display','block');
				//jQuery('html').css('padding-top',heightSettings);
				if (position == "top" && !isMobile) {
					jQuery('#promotion-bar').animate({"margin-top":0},300); 
					jQuery('html').animate({"padding-top":heightSettings},300);
					jQuery('#admin_bar_iframe').css("display","none");
				}

				if (position =="bottom" && !isMobile) {
					jQuery('#promotion-bar').animate({"margin-bottom":0},300); 
					jQuery('html').animate({"padding-bottom":heightSettings},300)
				}

			}, timer*1000);
			
			
		});

		Inffuse.on("removeBar",function(){
			jQuery('#promotion-bar').remove()
			jQuery('html').css('padding-top',0);
		});
		Inffuse.on("fixfixed",function(x){
			if (x == "focus") {
				setTimeout(function() {
					var viewSize = window.innerHeight;
					var scrollSize = window.scrollY; 
					$('#promotion-bar').css('position','absolute');
					$('#promotion-bar').css(position,0);
					window.scrollTo(0, $('#promotion-bar').offset().top-100);
				}, 0);	
			}
			if (x == "blur") {
				$('#promotion-bar').css('position','fixed');
				$('meta[name=viewport]').attr('content', 'width=device-width,initial-scale=1,maximum-scale=' + (event.type == 'blur' ? 10 : 1));
				//document.querySelector('meta[name=viewport]').setAttribute('content','width=device-width,initial-scale=1.0,maximum-scale=10.0,user-scalable=1');
				if (position == "bottom") {
					$('#promotion-bar').css('bottom','0');
					$('#promotion-bar').css('top','');
				}
				else {
					$('#promotion-bar').css('top','0');
					$('#promotion-bar').css('bottom','');
				}
			}
		});

		Inffuse.on("mobile",function(x){
			if (position == 'top') {
				bar.css({"height": x, "margin-top":"-"+x, "overflow":"hidden"})
				jQuery('#promotion-bar').animate({"margin-top":0},300);
				jQuery('html').animate({"padding-top":x},300)

			}

			if (position == 'bottom') {
				jQuery('#promotion-bar').animate({"margin-bottom":0},300); 
				jQuery('html').animate({"padding-bottom":x},300)
				bar.css({"height": x, "overflow":"hidden"})
			}
			
		})

		Inffuse.on("collectedEmail",function(){
			sessionStorage.setItem("collectedEmail","1");

		});
	}

	InffuseWelcomebar.ready(initScript);
	sessionStorage.setItem("view","1");
	
}

// function __ShowSnow(settings)
// {

//     var snowsrc = settings.SnowImage;
//     var no = settings.Quantity;

//     var dx, xp, yp;    // coordinate and position variables
//     var am, stx, sty;  // amplitude and step variables
//     var i; 

//     var doc_width = $(window).width() - 10;
//     var doc_height = $(window).height();

//     dx = [];
//     xp = [];
//     yp = [];
//     am = [];
//     stx = [];
//     sty = [];
//     flakes = [];
//     for (i = 0; i < no; ++i) 
//     {
//         dx[i] = 0;                        // set coordinate variables
//         xp[i] = Math.random()*(doc_width-50);  // set position variables
//         yp[i] = Math.random()*doc_height;
//         am[i] = Math.random()*20;         // set amplitude variables
//         stx[i] = 0.02 + Math.random()/10; // set step variables
//         sty[i] = 0.7 + Math.random();     // set step variables

//         var flake = $("<div />");

//         var id = ("dot" + i);
//         flake.attr("id", id);
//         flake.css({
//                     position: "absolute",
//                     zIndex: i,
//                     top: "15px",
//                     left: "15px"
//                 });

//         flake.append("<img src='" + snowsrc + "'>");
//         flake.appendTo("body");

//         flakes[i] = $("#" + id);
//     }

//     var animateSnow;
//     animateSnow = function() 
//     {  
//         for (i = 0; i < no; ++ i) 
//         {
//             // iterate for every dot
//             yp[i] += sty[i];
//             if (yp[i] > doc_height - 50) 
//             {
//                 xp[i] = Math.random() * (doc_width - am[i] - 30);
//                 yp[i] = 0;
//                 stx[i] = 0.02 + Math.random() / 10;
//                 sty[i] = 0.7 + Math.random();
//             }
      
//             dx[i] += stx[i];
//             flakes[i].css("top", yp[i] + "px");
//             flakes[i].css("left", (xp[i] + am[i] * Math.sin(dx[i])) + "px");
//         }

//         snowtimer = setTimeout(animateSnow, 10);
//     };

// 	function hidesnow()
//     {
// 		if(window.snowtimer)
//             clearTimeout(snowtimer)

//         for (i = 0; i < no; i++)
//             flakes[i].hide();
// 	}
		
//     animateSnow();
// 	if (settings.HideSnowTime > 0)
//     	setTimeout(hidesnow, settings.HideSnowTime * 1000)
// }

// (function($) {
//     $.fn.snow = function(options) {
  
//     var settings = $.extend({
//             SnowImage:      undefined,
//             Quantity:       7,
//             HideSnowTime:   0
//         }, options);

//     __ShowSnow(settings);

//     return this;
//   }

// })(jQuery);


// $(document).snow({ SnowImage: "/snow/snow.gif" });
