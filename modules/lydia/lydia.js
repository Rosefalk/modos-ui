//dependencies jQuery

core.modules.lydia.instance = {
    moduleData : {
        location    : "modules/lydia/",
        lydiaVersion: 0.1,
        $blink      : undefined,
        $textField  : undefined,
        commandKey  : 112,
        lydiaSpeed  : 15,
        open        : false,
        textRepeater: undefined,
        queueData  : [],
        commandList : [{command:"help",func: function(){
            var self = this;
            core.modules.lydia.instance.writeText("All loaded modules are listed in core.modules.instance",true)
            core.modules.lydia.instance.writeText("no other functionality has been added to me at this point",true)
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
    writeQueue: function(){
        var self = this;
        if(self.moduleData.textRepeater===undefined && self.moduleData.queueData.length>0){
            self.moduleData.$textfield = $(document.createElement("span"));
            self.moduleData.$blink.before(self.moduleData.$textfield);
            self.moduleData.$blink.css("display","none");
            var counter=0;
            self.moduleData.textRepeater = setInterval(function(){
                self.textRelay(counter)
                counter++;
            }, self.moduleData.lydiaSpeed);
        }
    },
    textRelay: function(counter){
        var self = this;
        var data = self.moduleData.queueData[0];
		if(counter <= data.length)
		{
			self.moduleData.$textfield.append(data[counter]);
			counter++;
		}
		else
		{
			self.moduleData.$blink.before("<br />");
            self.moduleData.$blink.css("display","block");
			clearInterval(self.moduleData.textRepeater);
            self.moduleData.textRepeater=undefined;
            self.moduleData.queueData.shift();
            self.writeQueue();
			return false;
		}
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

        self.moduleData.queueData.push(data)
        self.writeQueue();
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
