var statix = require('node-static'),
    http = require('http'),
    Faye = require('faye'),
    diceRollExtension = require("./extensions/dice-roll"),
    gifMeExtension = require("./extensions/gif-me"),
    scriptFilterExtension = require('./extensions/script-filter.js'),
    messageLogging = require('./extensions/message-logger.js'),
    autoHtmlExtension = require("./extensions/auto-html"),
    emojiExtension = require("./extensions/emojis"),
    queueMeExtension = require("./extensions/queue-me");

var bayeux = new Faye.NodeAdapter({
    mount: '/faye',
    timeout: 45,
    ping: 20
});

var dataStore = require("./storage/loader").load(process.env);
var messageHistoryServer = require("./server/message-history").new(dataStore);
var fileServer = new(statix.Server)('./www');
var heartBeat = require("./extensions/heart").new(bayeux.getClient());
var playQueue = require("./play-queue").new(bayeux.getClient());

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
bayeux.addExtension(heartBeat.extension);
bayeux.addExtension(scriptFilterExtension);
bayeux.addExtension(queueMeExtension(playQueue));
bayeux.addExtension(autoHtmlExtension);
bayeux.addExtension(gifMeExtension);
bayeux.addExtension(diceRollExtension("dice me"));
bayeux.addExtension(emojiExtension);
bayeux.addExtension(messageLogging(dataStore));


module.exports = {
    "listen": function(port) {
        server.listen(port);
        return server;
    },
    "close": function() {
        server.close();
    }
};
