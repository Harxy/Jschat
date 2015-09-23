var statix = require('node-static'),
    http = require('http'),
    Faye = require('faye'),
    diceRollExtension = require("./extensions/dice-roll"),
    gifMeExtension = require("./extensions/gif-me"),
    scriptFilterExtension = require('./extensions/script-filter.js'),
    messageLogging = require('./extensions/message-logger.js'),
    autoHtmlExtension = require("./extensions/auto-html"),
    emojiExtension = require("./extensions/emojis");

var dataStore = require("./storage/loader").load(process.env);
var bayeux = new Faye.NodeAdapter({mount: '/faye', timeout: 5 });
var messageHistoryServer = require("./server/message-history").new(dataStore);
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



module.exports = {
    "listen": function(port) {
        server.listen(port);
        console.log('listening on: ' + port);
        return server;
    }
};