console.info("Greetings fellow developer!")

var core = {
    moduleData:{
        location            : "modules/core/",
        moduleLocation      : "modules",
        moduleNameArray     : [],
        $contentContainer   : undefined,
        $topUILayer         : undefined,
        isMobile            : undefined
    },
    modules:
    {
        icon: {
            name: "icon",
            location:"icon",
            scripts:["icon.js"]
        },
        stickyNote:{
            name: "stickynote",
            location:"stickynote",
            scripts:["stickynote.js"]
        },
        wallpapers:{
            name: "wallpapers",
            location:"wallpapers",
            scripts:["wallpapers.js"]
        },
        searchbar:{
            name: "searchbar",
            location:"searchbar",
            scripts:["searchbar.js"]
        },
        lydia:{
            name: "lydia",
            location:"lydia",
            scripts:["lydia.js"]
        },
        clock:{
            name: "clock",
            location:"clock",
            scripts:["clock.js"]
        },
        licenses:{
            name: "licenses",
            location:"licenses",
            scripts:["licenses.js"]
        },
        crochet_tension_calculator:{
            name: "crochet_tension_calculator",
            location:"crochet_tension_calculator",
            scripts:["crochet_tension_calculator.js"]
        },
        burger_menu:{
            name: "burger_menu",
            location:"burger_menu",
            scripts:["burger_menu.js"]
        }/*,
        sun_moon_wallpaper:{
            name: "sun_moon_wallpaper",
            location:"sun_moon_wallpaper",
            scripts:["sun_moon_wallpaper.js"]
        }*/
    },
    util: {
        loadCSS: function(location,name){
            $('<link>')
            .appendTo('head')
            .attr({type : 'text/css', rel : 'stylesheet'})
            .attr('href', location+name+".css");
        },
        isMobile: function(){
            try{ document.createEvent("TouchEvent"); return true; }
            catch(e){ return false; }
        },
        arrayReturnDiff: function(arr1,arr2){
            var diff=[];
            jQuery.grep(arr1, function(el) {
                if (jQuery.inArray(el, arr2) == -1) diff.push(el);
            });
            return diff;
        },
        //loading a single module is slightly different and inefficient
        loadModule: function(module){
            var self=this;
            console.info("loading module: "+module.name)
            //create shim object with correct name
            var shim = ($.parseJSON('{ "'+module.name+'": "test" }'))
            //inject the module into the correctly named object
                shim[Object.keys(shim)[0]]=module;
            //add it to the module library
            $.extend( core.modules, shim );
            //make sure to also add it to the module name array for consistency
            core.moduleData.moduleNameArray.push(module.name);
            //PS:if it's stupid and it works it aint stupid
            var url = core.moduleData.moduleLocation+"/"+module.location+"/"+module.scripts;
            $.ajax({
                url: url,
                dataType: "script",
                success: function(){
                    if(core.util.dependencyCheck(module)){
                        if($.type(module.instance.init)=="function"){
                            module.instance.init();
                        }
                    }else{
                        console.warn(module.name+"is missing the following dependencies: "+diff+", Status: inactive")
                    }
                },
                error: function(jqXHR,error){
                  console.log("Error Loading: "+url+" : "+error+", code:"+jqXHR.status)
                }
            });
        },
        dependencyCheck:function(module){
            var self = this;
            var dependencies = module.instance.moduleData.dependencies;
            var diff;
            if(dependencies==undefined){
                result=true;
            }else{
                diff = core.util.arrayReturnDiff(dependencies,core.moduleData.moduleNameArray);
                result = (diff.length==0)?true:false;
            }
            return result;
        }
    },
    init: function(){
        var self = this;
        //load core css
        self.util.loadCSS(self.moduleData.location,"style")
        //what interaction type are we expecting?
        self.moduleData.isMobile = self.util.isMobile();
        //set render targets
        core.moduleData.$topUILayer = $("#modos-wrapper");
        core.moduleData.$contentContainer = $("#content");
        //initArray will delay execution of init functions until all modules are loaded
        var initArray = [];
        //moduleNameArray will only store the names of modules, it is true that initArray
        //has the data, but I think it's faster to have an extra array of data than to
        //loop through initArray and make it again later
        self.moduleData.moduleNameArray = []
        //counter will keep track of index, when $.each is used on an object it will
        //change parameters from (index, value) to (key,value) pair.
        var counter = 0;
        //moduleLength keeps track of how many modules are set to load
        var moduleLength = Object.keys(core.modules).length;
        //we need to delay runtime (init) of each module until they're all loaded and ready
        //that way we won't be bothered with dependencies needing each other.
        $.each(core.modules,function(i,v){
            //remember: key, value pair, not index
            var url = core.moduleData.moduleLocation+"/"+v.location+"/"+v.scripts;
            $.ajax({
              url: url,
              dataType: "script",
              success: function(){
                counter++;
                if($.type(v.instance.init)=="function"){
                    //storing key/value pair in array
                    initArray.push([i,v]);
                    //just the name
                    self.moduleData.moduleNameArray.push(i);
                }
                //we're resolving all instances when all modules are loaded
                //that way we can roll through all module's dependencies
                if(counter == moduleLength){
                    $(initArray).each(function(i,v){
                        var result = false;

                        if(core.util.dependencyCheck(v[1])){
                            v[1].instance.init();
                        }else{
                            console.warn(v[0]+"is missing the following dependencies: "+diff+", Status: inactive")
                        }
                    });
                    TweenMax.to(self.moduleData.$contentContainer,0.5,{delay:0.5,opacity: 1});
                }
              },
              error: function(jqXHR,error){
                  console.log("Error Loading: "+url+" : "+error+", code:"+jqXHR.status)
              }
            });
        })
    }

}

$(document).ready(function(){
    core.init();
})
