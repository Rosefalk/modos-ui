//dependencies jQuery

core.modules.sun_moon_wallpaper.instance = {
    moduleData : {
        location : "modules/sun_moon_wallpaper/",
        $universe: undefined,
        $star: undefined
    },
    updateOrbit: function(angle){
        var self = this;


        //not a math wizard
        var height = (self.moduleData.$star.height()/2)
        var width = (self.moduleData.$star.width()/2)
        var radiusW = window.innerWidth/2 -width
        //radiusH is not halved to keep a perfect circle
        var radiusH = window.innerHeight*0.1 - height
        var offsetX = (window.innerWidth/2) -width
        var offsetY = (window.innerHeight)- height
        var x = offsetX + Math.sin(angle)*radiusW
        var y = offsetY + Math.cos(angle)*radiusH
        console.log(offsetX,offsetY)
            self.moduleData.$star.css({left:x+"px",top:y+"px"})

    },
    init: function(){
        var self = this;
        //load Dependency: css
        core.util.loadCSS(self.moduleData.location,"style")
        //create DOM elements
        $.ajax({
          url: self.moduleData.location+"sun_moon_wallpaper.html",
          dataType: "html",
          success: function(data){
              core.moduleData.$topUILayer.append(data)
              self.moduleData.$universe = $("#universe:last")
              self.moduleData.$star = $(".star:last")
              self.updateOrbit();
          }
        });
    }
}
