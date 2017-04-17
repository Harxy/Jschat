var statix = require('node-static'),
    http = require('http'),
    Faye = require('faye'),
    diceRollExtension = require("./extensions/dice-roll"),
    gifMeExtension = require("./extensions/gif-me"),
    scriptFilterExtension = require('./extensions/script-filter.js'),
    messageLogging = require('./extensions/message-logger.js'),
    autoHtmlExtension = require("./extensions/auto-html"),
    emojiExtension = require("./extensions/emojis"),
    queueMeExtension = require("./extensions/queue-me"),
    storageLoader = require("./storage/loader"),
    whisperExtension = require("./extensions/whisper.js");

var createApp = function() {
    var self = {};
    var bayeux = new Faye.NodeAdapter({
        mount: '/faye',
        timeout: 45,
        ping: 20
    });
    
    var dataStore = storageLoader.loadMessageStore(process.env);
    var messageHistoryServer = require("./server/message-history").new(dataStore);
    var fileServer = new(statix.Server)('./www');
    var heartBeat = require("./extensions/heart").new(bayeux.getClient());
    
    var queueStorage = storageLoader.loadPlayQueueStore(process.env);
    var playQueue = require("./play-queue").new(bayeux.getClient(), queueStorage);
    playQueue.loadPersistedQueues();
    
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
    bayeux.addExtension(queueMeExtension("queue me", playQueue));
    bayeux.addExtension(autoHtmlExtension);
    bayeux.addExtension(gifMeExtension("gif me"));
    bayeux.addExtension(diceRollExtension("dice me"));
    bayeux.addExtension(emojiExtension("emoji me"));
    bayeux.addExtension(messageLogging(dataStore));
    bayeux.addExtension(whisperExtension);

    self.listen =  function(port) {
        server.listen(port);
        return self;
    };
    self.close = function() {
        heartBeat.stop();
        playQueue.stop();
        bayeux.getClient().disconnect();
        bayeux.close();
        server.close();
    };
    return self;
};

module.exports = {
    "create": createApp
};