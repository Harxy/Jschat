var request = require("request");
var GifMeExtension = {
    outgoing: function (message, callback) {
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
module.exports = GifMeExtension;
