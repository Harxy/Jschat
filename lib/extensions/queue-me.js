var request = require("request");

var queueMeExtension = function(playQueue) {
    return {
        incoming: function (message, callback) {
            var dontSend = false;

            if (message.data && message.data.text) {
                var queueMeKeyword = "queue me";
                if (message.data.text.indexOf(queueMeKeyword) !== 0) {
                    callback(message);
                    return;
                }
                dontSend = true;
                var input = message.data.text.slice(queueMeKeyword.length).trim();
                var service = input.split('.')[1];
                var param = input.split('.')[2].split('=')[1];
                var personName = message.data.name;
                var room = message.channel.slice(message.channel.lastIndexOf('/') + 1);

                var url = 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBTC9rz58mNSUQcvpxksGPVGbsFIWNO1-M&part=snippet,contentDetails&id=' + param;
                request({
                    url: url
                }, 
                function(error, response, body) {
                    var JSONbody = JSON.parse(body);
                    if (!error && response.statusCode === 200) {
                        if (body.length > 0) {
                            personName = message.data.name;
                            message.data.name = "QueueBot";
                            message.data.text = personName + ' added something to the queue';
                            playQueue.queueItem( room,
                                    { data:{
                                               'service': service,
                                               id: param,
                                               'title': JSONbody.items[0].snippet.title
                                           },
                                        duration: convert_time(JSONbody.items[0].contentDetails.duration)*1000, 
                                        requester: personName
                                    });
                        }
                    }
                    callback(message);
                });
            }
            if(!dontSend)
                callback(message);
        }
    };
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
    return duration;
}
module.exports = queueMeExtension;
