var request = require("request");

var youtubeMeExtension = function(playQueue) {
    return {
        incoming: function (message, callback) {
            var dontSend = false;

            if (message.data && message.data.text) {
                var youtubeMeKeyword = "youtube me";
                if (message.data.text.indexOf(youtubeMeKeyword) !== 0) {
                    callback(message);
                    return;
                }
                dontSend = true;
                var param = message.data.text.slice(youtubeMeKeyword.length).trim();
                var personName = message.data.name;
                var room = message.channel.slice(message.channel.lastIndexOf('/') + 1);

                var url = 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBTC9rz58mNSUQcvpxksGPVGbsFIWNO1-M&part=snippet,contentDetails&id=' + param;
                request({
                    url: url
                }, function(error, response, body) {
                    JSONbody = JSON.parse(body);
                    if (!error && response.statusCode === 200) {
                        if (body.length > 0) {
                            message.data.text = "videobot";
                            message.data.text = message.data.name + ' added something to the queue';
                            playQueue.queueItem( room, {data: {'service': "youtube", id: param, 'title': JSONbody.items[0].snippet.title}, duration: convert_time(JSONbody.items[0].contentDetails.duration)*1000, requester: message.data.name});
                        }
                    }
                    callback(message);
                });
            }
            if(!dontSend)
                callback(message);
        }
    }
};

function convert_time(duration) {
    var a = duration.match(/\d+/g);

    if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
        a = [0, a[0], 0];
    }

    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
        a = [a[0], 0, a[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
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
    return duration
}
module.exports = youtubeMeExtension;
