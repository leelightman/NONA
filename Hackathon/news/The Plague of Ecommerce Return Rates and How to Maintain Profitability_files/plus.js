!function(e){e(function(){var i,s,o=e(".blog-promo-bar"),n=5e3;o.length&&"true"!==ShopifyMarketing.Helpers.Cookie.get("blog_promo_dismissed")&&(i=o.find(".blog-promo-bar__close"),setTimeout(function(){o.addClass("js-is-measuring js-is-visible"),s=o.outerHeight(),o.removeClass("js-is-measuring"),o.prepareTransition().height(s),o.one("transitionended",function(){o.addClass("js-is-open"),o.height("auto")}),Modernizr.csstransitions||o.trigger("transitionended")},n),i.on("click",function(){var e=new Date;e.setTime(e.getTime()+6048e5),ShopifyMarketing.Helpers.Cookie.set("blog_promo_dismissed","true",{expires:e.toUTCString()}),s=o.outerHeight(),o.height(s),o.prepareTransition().removeClass("js-is-open"),o.height(0),o.one("transitionended",function(){o.removeClass("js-is-visible")}),Modernizr.csstransitions||o.trigger("transitionended")}))})}(jQuery);