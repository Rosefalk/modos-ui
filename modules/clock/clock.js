//dependencies jQuery

//possible buildouts: alarm, weather hoockup/slot
core.modules.clock.instance = {
    moduleData : {
        location        : "modules/clock/",
        $clockStage     : undefined,
        $clock          : undefined,
        $clockTextBox   : undefined,
        timeUpdate      : undefined,
        clockText       : [
            {time: 6 ,name:"morning",text:"Good Morning"},
            {time: 11,name:"midday",text:"Good Afternoon"},
            {time: 18,name:"evening",text:"Good Evening"},
            {time: 22,name:"night",text:"Sweet Dreams"}
        ]
    },
    setTime: function(){
        var self = this;
        //this part should be obvious
        var now = new Date;
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var text = "";
        $(self.moduleData.clockText).each(function(i,v){
            //no need to do a range check since it will take the last valid time
            if(hours >= v.time){
                text = v.text;
                //no reason to continue the loop, we found what we need
                return;
            }
        })
        self.moduleData.$clockTextBox.text();
        //reusing variable, cause recycling is good, also hours/minutes
        //will return 1 for 1 minute, not 01, so we check for self
        hours = ((""+hours).length==1)?("0"+hours):hours;
        minutes = ((""+minutes).length==1)?("0"+minutes):minutes;
        self.moduleData.$clock.text(hours+":"+minutes);
        self.moduleData.$clockTextBox.text(text);

    },
    initTime: function(){
        var self = this;
        //update is set to every 10s just to make sure overlap isn't too huge
        self.moduleData.timeUpdate = setInterval(function(){
            self.setTime();
        },10000)
        self.setTime();
    },
    init: function(){
        var self = this;
        //load Dependency: css
        core.util.loadCSS(self.moduleData.location,"style")
        //create DOM elements
        var $body = $("body");
        $.ajax({
          url: self.moduleData.location+"clock.html",
          dataType: "html",
          success: function(data){
              core.moduleData.$topUILayer.append(data)
              self.moduleData.$clock = $("#clock")
              self.moduleData.$clockTextBox = $("#clock-textbox")
              //init here since ajax is asynchronous and initTime->setTime
              //won't know of $clock until this block is loaded
              self.initTime();
          }
        });
    }
}
