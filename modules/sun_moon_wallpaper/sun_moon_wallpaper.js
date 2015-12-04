//dependencies jQuery

core.modules.sun_moon_wallpaper.instance = {
    moduleData : {
        location : "modules/sun_moon_wallpaper/",
        $universe: undefined,
        $star: undefined,
        $moon: undefined,
        dayImg: "",
        $nightImg: ""
    },
    updateScene:function(now){
        var self = this;
        var nightOpacity    = 0;

        if(now >= 20 && now <= 24){
            nightOpacity = (4-(24-now))/4;
            console.log("op",nightOpacity)
        }
        else if(now >=0 && now <= 5){
            nightOpacity = (5-now)/5;
        }
        nightOpacity
        self.moduleData.$nightImg.css("opacity",nightOpacity)
    },
    updateOrbit: function(object,translation,forceTime){
        var self = this;
        //a full revolution is 2PI and 24 hours
        var PI_Time = 2*Math.PI/24;

        var now;
        if(forceTime==undefined){
            now = new Date;
            var hours = now.getHours();
            var minutes = now.getMinutes();
            var now = (hours+((100/60)*minutes)/100);
        }else{
            now = forceTime;
        }
        console.log(now)
        self.updateScene(now);
        //not a math wizard, but it kinda looks like this:
        //https://upload.wikimedia.org/wikipedia/commons/6/67/2pi-unrolled.gif
        //basically the bottom of the circle is 0 and a full revolution is 2PI so we need to translate it by
        //half a pi to move the starting point (mid day) to top.
        var height = (object.height()/2);
        var width = (object.width()/2);
        var radiusW = window.innerWidth/2 -width;
        //radiusH is not halved to keep a perfect circle
        var radiusH = window.innerHeight - height;
        var offsetX = (window.innerWidth/2) -width;
        var offsetY = (window.innerHeight) - height;
        var x = offsetX + Math.sin(now*PI_Time+(translation))*radiusW;
        var y = offsetY + Math.cos(now*PI_Time+(translation))*radiusH;

        object.css({left:x+"px",top:y+"px"});
    },
    initOrbit: function(){
        var self = this;
        self.updateOrbit(self.moduleData.$star,0);
        self.updateOrbit(self.moduleData.$moon,Math.PI);

        setInterval(function(){
            self.updateOrbit(self.moduleData.$star,0);
            self.updateOrbit(self.moduleData.$moon,Math.PI);
        },10000)

        /*
        //simulated fast cycle
        var counter=0;
        setInterval(function(){
            self.updateOrbit(self.moduleData.$star,0, counter);
            self.updateOrbit(self.moduleData.$moon,Math.PI, counter);
            counter+=0.01
            if(counter>24){
                counter=0;
            }
        },10)
        */
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
                self.moduleData.$moon = $(".moon:last")
                self.moduleData.$nightImg = $(".night:last")
                self.initOrbit();
            }
        });
    }
}
