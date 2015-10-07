var extensionHelper = require("./extension-helper.js");

var queueMeExtension = function(keyword, playQueue, request) {
    request = request || require("request");
    return {
        incoming: function(message, callback) {
            var unsanitisedParam = extensionHelper.CheckMessageForKeyword(message, keyword, true);

            if (!unsanitisedParam) {
                callback(message);
                return;
            }

            var param = urlSanitiser(unsanitisedParam);
            var service = getService(param);
            var videoId = getVideoId(param);
            var personName = message.data.name;
            var room = message.channel.slice(message.channel.lastIndexOf("/") + 1);

            var url = "https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBTC9rz58mNSUQcvpxksGPVGbsFIWNO1-M&part=snippet,contentDetails&id=" + videoId;
            request({
                    url: url
                },
                function(error, response, body) {
                    var JSONbody = JSON.parse(body);
                    if (!error && response.statusCode === 200) {
                        if (body.length > 0) {
                            personName = message.data.name;
                            message.data.name = "QueueBot";
                            message.data.text = personName + " added something to the queue";
                            playQueue.queueItem(room,
                            {
                                data: {
                                    'service': service,
                                    id: videoId,
                                    'title': JSONbody.items[0].snippet.title
                                },
                                duration: convert_time(JSONbody.items[0].contentDetails.duration) * 1000,
                                requester: personName
                            });
                        }
                    }
                    callback(message);
                });
        }
    };
};

function urlSanitiser(url){
    url = url.replace(/[{()}]/g, '');
    url = url.replace(/[\[\]']+/g, '');
    return url;
}

function getService(url){
    var youtubeURLs = ['youtu', 'youtube'];
    var parsedURL = extensionHelper.parseURL(url);
    if (youtubeURLs.indexOf(parsedURL.host) != -1) {
        return 'youtube';
    }
}

function getVideoId(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return match[7];
}

function convert_time(duration) {
    var a = duration.match(/\d+/g);

    if (duration.indexOf("M") >= 0 && duration.indexOf("H") == -1 && duration.indexOf("S") == -1) {
        a = [0, a[0], 0];
    }

    if (duration.indexOf("H") >= 0 && duration.indexOf("M") == -1) {
        a = [a[0], 0, a[1]];
    }
    if (duration.indexOf("H") >= 0 && duration.indexOf("M") == -1 && duration.indexOf("S") == -1) {
        a = [a[0], 0, 0];
    }

    duration = 0;

    if (a.length == 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
    }

    if (a.length == 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
    }

    if (a.length == 1) {
        duration = duration + parseInt(a[0]);
    }
    return duration;
}

module.exports = queueMeExtension;
