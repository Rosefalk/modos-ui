//dependencies jQuery

core.modules.burger_menu.instance = {
    moduleData : {
        location : "modules/burger_menu/",
        menuOpen: false,
        onlyLoadIfMobile: false
    },
    init: function(){
        var self = this;
        if(self.moduleData.onlyLoadIfMobile && core.moduleData.isMobile){
            return;
        }
        //load Dependency: css
        core.util.loadCSS(self.moduleData.location,"style")
        //create DOM elements

        $.ajax({
            url: self.moduleData.location+"burger_menu.html",
            dataType: "html",
            success: function(data){
                core.moduleData.$topUILayer.append(data)
                var $container = $(".burger-menu-wrapper:last");

                $container.css("left",-$container.width())

                var clickType = "click";
                if(core.moduleData.isMobile){
                    clickType = "touchstart";
                }

                $container.find(".burger-menu-icon").on(clickType,function(){

                    var containerWidth = $container.width()

                    if(self.moduleData.menuOpen){
                        TweenMax.to($container,0.4,{left:-containerWidth});
                    }else{
                        TweenMax.to($container,0.4,{left:0});
                    }
                        self.moduleData.menuOpen = !self.moduleData.menuOpen;
                });
            }
        });
    }
}
