//dependencies jQuery, jQueryUI,jQuery UI Theme,icon module, Stickynote module

core.modules.licenses.instance = {
    moduleData: {
        dependencies    :["icon","stickyNote"],
        location        : "modules/licenses/",
        licenseBTNLabel : "Licenses",
        licenseText     : undefined
    },
    init: function init(){
        var self = this;
        //load Dependency: css
        core.util.loadCSS(self.moduleData.location,"style")
        //create DOM elements
        var $body = $("body");
        if(self.moduleData.licenseText==undefined){
            $.ajax({
                url : self.moduleData.location+"licenses.txt",
                dataType: "text",
                success : function (data) {
                    self.moduleData.licenseText = data;
                },error : function(error){
                    console.log("Licenses Module has failed to get txt file")
                }
            });
        }
        var func = function(){
            core.modules.stickyNote.instance.create(self.moduleData.licenseBTNLabel, self.moduleData.licenseText,false)
        };
        core.modules.icon.instance.create({icon:"Document 2",text:self.moduleData.licenseBTNLabel, func:func})
    }
}
