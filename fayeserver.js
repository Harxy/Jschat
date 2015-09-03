var    statix = require('node-static'),
       http = require('http'),
       Faye = require('faye'),
       request = require("request"),
       diceRollExtension = require("./extensions/dice-roll"),
       gifMeExtension = require("./extensions/gif-me");
       roomMeExtension = require("./extensions/room-me");

var bayeux = new Faye.NodeAdapter({mount: '/faye', timeout: 5 });

var file = new(statix.Server)('.');

var server = http.createServer(function(request, response) {
    request.addListener('end', function() {
      if (request.url.indexOf('/rooms/') === 0)
            file.serveFile('/index.html', 200, {}, request, response);
        else
            file.serve(request, response);
    }).resume();
});
var scriptFilterExtension = {
  incoming: function (message, callback) {
    if (message.data && message.data.text) {
      message.data.text = message.data.text.filterOutScriptTags();
    }
    callback(message);
  }
};

bayeux.attach(server);
bayeux.addExtension(scriptFilterExtension);
bayeux.addExtension(gifMeExtension);
// bayeux.addExtension(roomMeExtension);
bayeux.addExtension(diceRollExtension("dice me"));
var port = process.env.PORT || 8001;
server.listen(port);
console.log('listening on: ' + port);


// TODO: Probably should start separating stuff into separate files
String.prototype.filterOutScriptTags = function () {
    var i = 0, scriptTagLevel = 0;
    var result = "";
    var str = this.toString();
    while (i < str.length) {
        // if we're at the start of a script tag, increase the scriptTagLevel
        if (str.length - i >= 7 && str.substring(i, i + 7) == "\<script") {
            scriptTagLevel++;
            i = i + 7;
        // if we're at the end of a script tag, decrease the scriptTagLevel (don't let it go below 0)
        } else if (str.length - i >= 9 && str.substring(i, i + 9) == "\</script\>") {
            if (scriptTagLevel > 0) {
                scriptTagLevel--;
            }

            i = i + 9;
        // else, use the scriptTagLevel to determine whether to include the text or not
        } else {
            if (scriptTagLevel === 0) {
                result += str[i];
            }

            i++;
        }
    }

    return result;
};
