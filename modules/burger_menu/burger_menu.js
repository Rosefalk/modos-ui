//dependencies jQuery

core.modules.burger_menu.instance = {
    moduleData : {
        location : "modules/burger_menu/",
        menuOpen: false,
        onlyLoadIfMobile: false,
        $container: undefined,
        $list     : undefined
    },
    populate: function(json){
        var self = this;
        var $listItem = $(document.createElement("li"));
            $listItem.html(json.text);
        if(json.index=="first"){
            self.moduleData.$list.prepend($listItem);
        }
        else if(json.index == undefined || json.index=="last"){
            self.moduleData.$list.append($listItem);
        }else{
            var indx = json.index - 1;
            console.log(indx)
            if(indx==-1){
                indx=0;
                self.moduleData.$list.children("li").eq(indx).before($listItem);
            }else{
                self.moduleData.$list.children("li").eq(indx).after($listItem);
            }
        }

    },
    depopulate: function(json){
        var self = this;
        if(json.index=="first"){
            self.moduleData.$list.children("li").first().remove();
        }
        else if(json.index == undefined || json == undefined || json.index=="last"){
            self.moduleData.$list.children("li").last().remove();
        }
        else{
            self.moduleData.$list.children("li").eq(json.index).remove();
        }
    },
    flipBurger: function(bool){
        var self = this;
        var status;

        if(bool != undefined){
            status = bool;
        }else{
            status = !self.moduleData.menuOpen;
        }

        self.moduleData.menuOpen = status;

        if(self.moduleData.menuOpen){
            TweenMax.to(self.moduleData.$container,0.4,{left:0});
        }else{
            TweenMax.to(self.moduleData.$container,0.4,{
                left:-self.moduleData.$container.width()
            });
        }

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
                var $container = self.moduleData.$container = $(".burger-menu-wrapper:last");
                self.moduleData.$list = $container.find(".burger-menu-list");
                $container.css("left",-$container.width())

                var clickType = "click";
                if(core.moduleData.isMobile){
                    clickType = "touchstart";
                }

                $container.find(".burger-menu-icon").on(clickType,function(){
                    self.flipBurger();
                });
            }
        });
    }
}
