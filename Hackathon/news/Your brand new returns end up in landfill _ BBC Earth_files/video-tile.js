!function(e){e.videoTile=function(i,t){var n=this;n.$el=e(i),n.el=i,n.video=n.$el.find("video").get(0),n.$el.data("videoTile",n),n.init=function(){n.options=e.extend({},e.videoTile.defaultOptions,t);try{n.video&&null==n.video.getAttribute("src")&&n.video.setAttribute("src",n.video.getAttribute("data-src"))}catch(i){}},n.init()},e.videoTile.defaultOptions={autoPlay:!1,videoTitle:null,videoUrl:null,videoType:null,forceFlash:!1,flashSwf:ASSET_DIR+"/player/jwplayer.flash.swf",playerKey:"KZ/jXZU+gVMzMze8rx9LLMBriSn2np1KIKu34msSIxaaqDBr"},e.fn.videoTile=function(i){return this.each(function(){new e.videoTile(this,i);var t=e(this).data("videoTile");try{t.video&&(t.video.muted="muted",t.$el.on("mouseover",function(){}).on("mouseout",function(){}),t.video.addEventListener("playing",function(){}),t.video.addEventListener("canplay",function(){t.$el.addClass("canplay")}),t.video.addEventListener("loadeddata",function(){}))}catch(n){}})}}(jQuery);