var    statix = require('node-static'),
       http = require('http'),
       Faye = require('faye'),
       request = require("request");

var bayeux = new Faye.NodeAdapter({mount: '/faye', timeout: 5 });

var file = new(statix.Server)('.');

var server = http.createServer(function(request, response) {
    request.addListener('end', function() {
        file.serve(request, response);
    }).resume();
});

var gifMeExtension = {
    incoming: function (message, callback) {
        var dontSend = false;

        if (message.data && message.data.text) {
            var gifMeKeyword = "gif me";

            if (message.data.text.indexOf(gifMeKeyword) !== 0) {
                callback(message);
                return;
            }

            dontSend = true;
            var param = message.data.text.slice(gifMeKeyword.length).trim();

            var url = 'http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=1&q=' + param;
            request({
                url: url,
                json: true
            }, function(error, response, body) {

                if (!error && response.statusCode === 200) {
                    if (body.data.length > 0)
                        message.data.text = '<img src="' + body.data[0].images.original.url + '"/>';
                }

                callback(message);
            });
        }

        if(!dontSend)
            callback(message);
    }
};

var diceRollExtension = function(diceMeKeyword) {
    return {
        incoming: function (message, callback) {
            if (!message.data || !message.data.text) {
                callback(message);
                return;
            }
            if (message.data.text.indexOf(diceMeKeyword) !== 0) {
                callback(message);
                return;
            }

            var param = message.data.text.slice(diceMeKeyword.length).trim();
            request({
                url: "http://roll.diceapi.com/json/" + (param ? param : "d6"),
                json: true
            }, function(error, response, body) {
                message.data.name = "dice master";
                if (!error && response.statusCode === 200) {
                  var diceResult = response.body.dice
                    .map(function(dice){return dice.value;})
                    .join(", ");
                  message.data.text = 'The result was: ' + diceResult;
                } else {
                  message.data.text = "Sorry something went wrong with my dice.";
                }
                callback(message);
            });
        }
    };
};

bayeux.attach(server);
bayeux.addExtension(gifMeExtension);
bayeux.addExtension(diceRollExtension("roll dice"));
var port = process.env.PORT || 8001;
server.listen(port);
console.log('listening on: ' + port);
