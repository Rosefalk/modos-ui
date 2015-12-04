//dependencies jQuery

core.modules.lydia.instance = {
    moduleData : {
        location    : "modules/lydia/",
        lydiaVersion: 0.1,
        $blink      : undefined,
        commandKey  : 112,
        lydiaSpeed  : 15,
        open        : false,
        commandList : [{command:"help",func: function(){
            var self = this;
            core.modules.lydia.instance.writeText(
                "This is helpful help text that helps!",true)
        }},
        {command:"forest",func: function(){
            var self = this;
            core.modules.lydia.instance.writeText(
                "Life is like a box of chocolates",true)
        }}
        ]
    },
    blink: function($selector)
	{
        var self = this;
        TweenMax.to($selector,0.5,{opacity:0, onComplete: function(){
            TweenMax.to($selector,0.5,{opacity:1, onComplete: function(){
                self.blink($selector);
            }})
        }})
	},
	writeText: function(string, ignoreCommands)
	{
        var self = this;
		data = string.toString();

        if(!ignoreCommands && data.substring(0,4) == "run "){
            var command = data.substring(4)
            var test = false;
            var commandObj=$.grep(self.moduleData.commandList, function( object, index ) {
                if(object.command==command){
                    test = true;
                    return object;
                }
            });
            commandObj = commandObj[0];

            if(test){
                commandObj.func();
                return false;
            }else{
                data=data+">command not found";
            }
        }

		var counter = 0;

        var textfield = $(document.createElement("span"));
        self.moduleData.$blink.before(textfield);
        self.moduleData.$blink.css("display","none");
		var id = setInterval(function ()
		{
			if(counter <= data.length)
			{
				textfield.append(data[counter]);
				counter++;
			}
			else
			{
				self.moduleData.$blink.before("<br />");
                self.moduleData.$blink.css("display","block");

				clearInterval(id);
				return false;
			}
		}, self.moduleData.lydiaSpeed);
	},
    init: function(){
        var self = this;
        //load Dependency: css
        core.util.loadCSS(self.moduleData.location,"style")
        //create DOM elements
        $.ajax({
          url: self.moduleData.location+"lydia.html",
          dataType: "html",
          success: function(data){
              core.moduleData.$topUILayer.append(data)
              self.moduleData.$lydia = $("#lydia")
              self.moduleData.$blink = self.moduleData.$lydia.find(".blink");
              self.blink(self.moduleData.$blink);

              self.moduleData.$lydia.children("#query").keyup(function (e) {
                  if (e.keyCode == 13) {
                      var $that = $(this);
                      var command = $that.val()
                      self.writeText(command)
                      $that.val("");
                  }
              });
            }
        });

        $("body").keyup(function (e) {
            if (e.keyCode == self.moduleData.commandKey) {
                if(self.moduleData.open){
                    TweenMax.to(self.moduleData.$lydia,0.5,{height: "0"});
                }else{
                    self.moduleData.$lydia.children("input").focus();

                    if(self.moduleData.$lydia.children("#console").text()==""){
                        TweenMax.to(self.moduleData.$lydia,0.5,{height: "60%", onComplete:function(){
                            self.writeText("Lydia V."+self.moduleData.lydiaVersion+' is now active. If you need help, use "run help".', true)
                        }});
                    }else{
                        TweenMax.to(self.moduleData.$lydia,0.5,{height: "60%"});
                    }
                }
                self.moduleData.open = !self.moduleData.open;
            }
        });
    }
}
