core.modules.wallpapers.instance = {
    moduleData: {
        location        : "modules/wallpapers/",
        wallpapers      : ["clouds2.jpg","clouds.jpg"],
        transitionTime  : 25000,
        interval        : undefined,
        activeWallpaper : 0,
        $stage          : undefined,
        $stageOne       : undefined,
        $stageTwo       : undefined
    },
    setWallpaper: function(id,obj){
        var self = this;
        //first run we just set the wallpaper to stage one, no fuss
        obj.css("background-image", 'url("'+self.moduleData.location+self.moduleData.wallpapers[id]+'")')

    },
    getNextValidWallpaper: function(id){
        var self = this;
        var counter = id;
        if(counter < self.moduleData.wallpapers.length-1){
            counter++;
        }else{
            counter = 0;
        }
        return counter;
    },
    startCycling: function(){
        var self = this;
        /*Note: this can seem like a slightly convoluted way of doing it, but it's done this way
         *to preload the next wallpaper. This way there should be gapless fading between wallpapers
        */
        //init set wallpaper 1
        self.setWallpaper(self.moduleData.activeWallpaper,self.moduleData.$stageOne);
        //init set wallpaper 2
        self.setWallpaper(self.getNextValidWallpaper(self.moduleData.activeWallpaper),self.moduleData.$stageTwo);
        //start cycling
        self.moduleData.interval = setInterval(function(){
            //time to load next cycle so set active wallpaper id to the next valid one
            self.moduleData.activeWallpaper = self.getNextValidWallpaper(self.moduleData.activeWallpaper)
            //fade in wallpaper 2, set wallpaper 1, set wallpaper 2 opacity to 0 and set wallpaper 2
            //to the next valid wallpaper
            TweenMax.to(self.moduleData.$stageTwo,1,{opacity:1,onComplete:function(){
                self.setWallpaper(self.moduleData.activeWallpaper,self.moduleData.$stageOne);
                self.moduleData.$stageTwo.css("opacity",0);
                self.setWallpaper(self.getNextValidWallpaper(self.moduleData.activeWallpaper),self.moduleData.$stageTwo);
            }});
            
        },self.moduleData.transitionTime)
    },
    stopCycling: function(){
        var self = this;
        clearInterval(self.interval);
        self.interval=undefined;
    },
    init: function(){
        var self = this;
        //load Dependency: css
        core.util.loadCSS(self.moduleData.location,"style")

        //create DOM elements
        var $body = $("body");

        $.ajax({
          url: self.moduleData.location+"wallpaper.html",
          dataType: "html",
          success: function(data){
            /*all init code goes in here to sync everything up after
            *ajax turns it async
            *add DOM elements to moduleData
            */
            core.moduleData.$topUILayer.append(data)
            self.moduleData.$stage = core.moduleData.$topUILayer.children("#wallpaper-stage");
            self.moduleData.$stageOne = self.moduleData.$stage.children("#wallpaper-one");
            self.moduleData.$stageTwo = self.moduleData.$stage.children("#wallpaper-two");

            if(self.moduleData.wallpapers.length >1){
                self.startCycling();
            }else{
                self.setWallpaper(0,self.moduleData.$stageOne);
            }
          }
        });
    }
}
/*
self.setWallpaper(0,self.moduleData.$stageTwo);
TweenMax.to(self.moduleData.$stageTwo,1,{opacity:1,onComplete:function(){
    self.setWallpaper(0,self.moduleData.$stageOne);
    self.moduleData.$stageTwo.css("opacity",0)     */
