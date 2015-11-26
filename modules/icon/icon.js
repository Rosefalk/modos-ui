//requires jQuery, doT
core.modules.icon.instance = {
    moduleData: {
        location        : "modules/icon/",
        theme           : "modules/icon/icons/woocons1/",
        defaultIcon     : "Document 1.png"
    },
    create: function(parameterList){
        var self = this;
        var params = parameterList;
        if(parameterList==undefined){
            params={}
        }

        var parameters = {
            icon     : (params.icon!=undefined)?self.moduleData.theme+params.icon+".png":self.moduleData.theme+self.moduleData.defaultIcon,
            text     : (params.text!=undefined)?params.text:"text",
            func     : (params.func!=undefined)?params.func:undefined,
            $content : (params.container!=undefined)?params.container:core.moduleData.$contentContainer
        }
        //create DOM elements
        $.ajax({
          url: self.moduleData.location+"icon.html",
          dataType: "html",
          success: function(data){
              var template = doT.template(data)
              var compiled = template(parameters)
              parameters.$content.append(compiled)
              core.moduleData.$contentContainer.on("click touchstart",function(e){
                  parameters.$content.children(".icon").removeClass("selected");
              })

              if(core.moduleData.isMobile){
                  parameters.$content.children(".icon:last").on("touchstart",function(e){
                      e.stopPropagation();
                      parameters.$content.children(".icon").removeClass("selected");
                      $(this).addClass("selected")
                      if(parameters.func!=undefined){
                          parameters.func();
                      }
                  })
              }else{
                  parameters.$content.children(".icon:last").on("click",function(e){
                      e.stopPropagation();
                      parameters.$content.children(".icon").removeClass("selected");
                      $(this).addClass("selected")
                  })
                  if(parameters.func!=undefined){
                      parameters.$content.children(".icon:last").on("dblclick",parameters.func)
                  }
              }
          }
        });
    },
    init:function(){
        var self = this;
        //load Dependency: css
        core.util.loadCSS(self.moduleData.location,"style")
    }
}
