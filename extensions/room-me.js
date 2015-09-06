var request = require("request");
var RoomMeExtension = {
    incoming: function (message, callback) {
        var dontSend = false;


        if (message.data && message.data.text) {
            var roomMeKeyword = "room me";
            if (message.data.text.indexOf(roomMeKeyword) !== 0) {
                callback(message);
                return;
            }

            dontSend = true;
            var param = message.data.text.slice(roomMeKeyword.length).trim();
            message.data.text = message.data.text = "<a href='/rooms/" + param. toLowerCase() + "'>" + param + "</a>";
            callback(message);
        }

        if(!dontSend)
            callback(message);
    }
};
module.exports = RoomMeExtension;
