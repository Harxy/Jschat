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

var scriptFilterExtension = {
    incoming: function (message, callback) {
        if (message.data && message.data.text) {
            message.data.text = message.data.text.filterOutScriptTags();
        }

        callback(message);
    }
};

bayeux.attach(server);
bayeux.addExtension(gifMeExtension);
bayeux.addExtension(scriptFilterExtension);

var port = process.env.PORT || 8123;
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