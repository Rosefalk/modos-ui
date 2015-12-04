//dependencies jQuery

core.modules.searchbar.instance = {
    moduleData: {
        location: "modules/searchbar/",
        searchbar: undefined
    },
    search: function(uri){
        window.open("https://www.google.dk/search?q="+uri)
    },
    init: function() {
        var self = this;
        //load Dependency: css
        core.util.loadCSS(self.moduleData.location, "style")
        //create DOM elements

        $.ajax({
          url: self.moduleData.location+"searchbar.html",
          dataType: "html",
          success: function(data){
              core.moduleData.$topUILayer.append(data)
              self.moduleData.$searchbar = $("#searchbar")
              self.moduleData.$searchbar.children("input").one("click touchstart",function(){
                  $(this).val("");
              })
              self.moduleData.$searchbar.children("input").keyup(function (e) {
                  if (e.keyCode == 13) {
                      self.search($(this).val())
                  }
              });
            }
        });
    }
}
