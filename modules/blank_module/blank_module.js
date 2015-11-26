//dependencies jQuery

core.modules.blank.instance = {
    moduleData : {
        location : "modules/blank/",
    },
    init: function(){
        var self = this;
        //load Dependency: css
        core.util.loadCSS(self.moduleData.location,"style")
        //create DOM elements
    }
}
