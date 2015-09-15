var request = require("request");

var createInlineGif = function (selected) {
    return '<img src="' + selected.images.original.url + '"/>';
};
var createRudeGifLink = function (selected) {
    return '<a href="' + selected.images.original.url + '">Rude gif</a>';
};
var workSafeRatings = ["pg-13", "pg", "g", "y"];
var isGifWorkSafe = function (selected) {
    return !selected.rating || workSafeRatings.indexOf(selected.rating);
};

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

            var url = 'http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=10&q=' + param;
            request({
                url: url,
                json: true
            }, function(error, response, body) {

                if (!error && response.statusCode === 200) {
                    if (body.data.length > 0) {
                        var idToUse = Math.floor(Math.random() * (body.data.length));
                        var selected = body.data[idToUse];
                        // Only inline sfw gifs
                        if (isGifWorkSafe(selected)) {
                            message.data.text = createInlineGif(selected);
                        } else {
                            message.data.text = createRudeGifLink(selected);
                        }
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
