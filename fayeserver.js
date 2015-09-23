var    statix = require('node-static'),
       http = require('http'),
       Faye = require('faye'),
       diceRollExtension = require("./lib/extensions/dice-roll"),
       gifMeExtension = require("./lib/extensions/gif-me"),
       scriptFilterExtension = require('./lib/extensions/script-filter.js'),
       messageLogging = require('./lib/extensions/message-logger.js'),
       autoHtmlExtension = require("./lib/extensions/auto-html"),
       emojiExtension = require("./lib/extensions/emojis");

var dataStore = require("./lib/storage/loader").load(process.env);
var bayeux = new Faye.NodeAdapter({mount: '/faye', timeout: 5 });
var messageHistoryServer = require("./lib/server/message-history").new(dataStore);
var fileServer = new(statix.Server)('./www');

var server = http.createServer(function(request, response) {
    request.addListener('end', function() {
        if (request.url.indexOf('/rooms/') === 0) {
            fileServer.serveFile('/index.html', 200, {}, request, response);
        } else if (request.url.indexOf('/history/') === 0) {
            messageHistoryServer.serve(request, response);
        } else {
            fileServer.serve(request, response);
        }
    }).resume();
});

bayeux.attach(server);
bayeux.addExtension(scriptFilterExtension);
bayeux.addExtension(autoHtmlExtension);
bayeux.addExtension(gifMeExtension);
bayeux.addExtension(diceRollExtension("dice me"));
bayeux.addExtension(emojiExtension);
bayeux.addExtension(messageLogging(dataStore));


var port = process.env.PORT || 8001;
server.listen(port);
console.log('listening on: ' + port);
