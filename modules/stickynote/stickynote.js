//requires jQuery, jQuery UI and jQuery UI Theme, icon module
core.modules.stickyNote.instance = {
    moduleData : {
        dependencies:["icon"],
        location    : "modules/stickynote/",
        showButton  : true,
        buttonLabel : "create note",
        stickyBtnID : "stickyButtonCreate",
        stickyBTN   : undefined,
        stickyText  : "Write Here",
        stickyTitle : "Note",
        stickyClass : "sticky"
    },
    create: function(title, content, editable){
        var self = this;
        var parameters = {
            title           : (title!=undefined)?title:"title",
            content         : (content!=undefined)?content:"content",
            contentEditable : (editable==true)?true:false
        }

        //create DOM elements
        var $body = $("body");
        var $sticky = $(document.createElement("div")).addClass(self.moduleData.stickyClass);
            $sticky.html(parameters.content)
        if(parameters.contentEditable){
            $sticky.attr("contentEditable",true)
        }

        $body.append($sticky);
        $sticky = self.moduleData.$sticky = $(".sticky:last")
        self.moduleData.$sticky.dialog({
            title:parameters.title,
            close: function(event, ui)
            {
                $(this).remove();
            }
        });
    },
    init: function(){
        var self = this;
        //load Dependency: css
        core.util.loadCSS(self.moduleData.location,"style")

        var $body = $("body");
        if(self.moduleData.showButton){
            var func = function(){
                self.create(self.moduleData.stickyTitle, self.moduleData.stickyText,true)
            };
            core.modules.icon.instance.create({icon:"Note Sticky",text:self.moduleData.stickyTitle, func:func})
        }
    }
}
