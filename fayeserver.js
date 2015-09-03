var    statix = require('node-static'),
       http = require('http'),
       Faye = require('faye'),
       request = require("request"),
       diceRollExtension = require("./extensions/dice-roll"),
       gifMeExtension = require("./extensions/gif-me"),
       dataStore = require('node-persist');

dataStore.initSync();

var bayeux = new Faye.NodeAdapter({mount: '/faye', timeout: 5 });

var file = new(statix.Server)('.');

var server = http.createServer(function(request, response) {
    request.addListener('end', function() {
        if (request.url.indexOf('/rooms/') === 0) {
            file.serveFile('/index.html', 200, {}, request, response);
        } else if (request.url.indexOf('/history/') === 0) {
            var room = request.url.slice(request.url.lastIndexOf('/') + 1);
            if (!room)
                room = 'undefined';

            var dataStoreId = 'messages.' + room;
            var messages = dataStore.getItem(dataStoreId);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end( JSON.stringify(messages) );

        } else {
            file.serve(request, response);
        }
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

var messageLogging = {
    outgoing: function (message, callback) {
        if (message.data && message.data.text) {
            var room = message.channel.slice(message.channel.lastIndexOf('/') + 1);
            var dataStoreId = 'messages.' + room;
            var messagesToKeep = 30;
            var currentMessages = dataStore.getItem(dataStoreId);
            if (!currentMessages)
                currentMessages = [];

            currentMessages.push(message);  
            dataStore.setItem(dataStoreId, currentMessages.slice(0,messagesToKeep));
        }
        
        callback(message);
    }
};

bayeux.attach(server);
bayeux.addExtension(scriptFilterExtension);
bayeux.addExtension(gifMeExtension);
bayeux.addExtension(diceRollExtension("dice me"));
bayeux.addExtension(messageLogging);
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
            if (scriptTagLevel == 0) {
                result += str[i];
            }

            i++;
        }
    }

    return result;
};
