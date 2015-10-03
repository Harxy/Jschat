var request = require("request");

var youtubeMeExtension = {
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
            var url = 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBTC9rz58mNSUQcvpxksGPVGbsFIWNO1-M&part=snippet&id=' + param;

            request({
                url: url
            }, function(error, response, body) {
                JSONbody = JSON.parse(body);
                console.log(message);
                if (!error && response.statusCode === 200) {
                    if (body.length > 0) {
                        message.data.text = "videobot";
                        message.data.text = message.data.name + 'added something to the queue';
                         playQueue.queueItem("blobby", {data: {'type': "youtube", id: param}, duration: 20000, requester: message.data.name});
                    }
                }
  
                callback(message);
            });
        }

        if(!dontSend)
            callback(message);
    }
};
module.exports = youtubeMeExtension;
