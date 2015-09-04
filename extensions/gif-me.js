var request = require("request");
var GifMeExtension = {
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

            var url = 'http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=25&q=' + param;
            request({
                url: url,
                json: true
            }, function(error, response, body) {

                if (!error && response.statusCode === 200) {
                    if (body.data.length > 0) {
                        var idToUse = Math.floor(Math.random() * (body.data.length));
                        message.data.text = '<img src="' + body.data[idToUse].images.original.url + '"/>';
                    }
                }

                callback(message);
            });
        }

        if(!dontSend)
            callback(message);
    }
};
module.exports = GifMeExtension;
