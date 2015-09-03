var    statix = require('node-static'),
       http = require('http'),
       Faye = require('faye'),
       request = require("request"),
       diceRollExtension = require("./extensions/dice-roll"),
       gifMeExtension = require("./extensions/gif-me");
       scriptFilterExtension = require("./extensions/script-filter");

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

bayeux.attach(server);
bayeux.addExtension(gifMeExtension);
bayeux.addExtension(diceRollExtension("dice me"));
bayeux.addExtension(scriptFilterExtension);

var port = process.env.PORT || 8001;
server.listen(port);
console.log('listening on: ' + port);
