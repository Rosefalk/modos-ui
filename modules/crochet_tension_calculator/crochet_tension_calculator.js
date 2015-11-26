//dependencies jQuery

core.modules.crochet_tension_calculator.instance = {
    moduleData : {
        location        : "modules/crochet_tension_calculator/",
        iconLabel       : "Crochet Tension Calculator"
    },
    calculate: function($container){
        var self = this;
        var b_cm = $container.find('input[name="width_cm"]').val();
        var b_m  = $container.find('input[name="width_stitches"]').val();
        var h_cm = $container.find('input[name="height_cm"]').val();
        var h_r  = $container.find('input[name="height_rows"]').val();
        var a_b  = $container.find('input[name="stitches_b"]').val();
        var a_h  = $container.find('input[name="stitches_h"]').val();

        $container.find('input[name="result"]').
        val("W:"+self.roundToTwoDecimalPoints((b_cm/b_m)*a_b)+"x"+
            "H:"+self.roundToTwoDecimalPoints((h_cm/h_r)*a_h));
    },
    roundToTwoDecimalPoints: function(num){
        return +(Math.round(num + "e+2")  + "e-2");
    },
    init: function(){
        var self = this;
        //load Dependency: css
        core.util.loadCSS(self.moduleData.location,"style")

        $.ajax({
            url: self.moduleData.location+"crochet_tension_calculator.html",
            dataType: "html",
            success: function(data){
                var func = function(){
                    $(data).dialog({title:self.moduleData.iconLabel});
                    var $container = $(".crochet_tension_container:last");

                    var clickType = "click";
                    if(core.moduleData.isMobile){
                        clickType = "touchstart";
                    }

                    $container.find("button").on(clickType,function(){
                        self.calculate($container);
                    })
                };
                core.modules.icon.instance.create({icon:"Ruler",text:self.moduleData.iconLabel, func:func})
              //core.moduleData.$contentContainer.append(data)
            }
        });
    }
}
