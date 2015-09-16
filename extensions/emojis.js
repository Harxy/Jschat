var emoji = require("node-emoji");


var EmojiExtension = {
    incoming: function (message, callback) {
        if (message.data && message.data.text) {
            message.data.text = emoji.emojify(message.data.text);
        }
        callback(message);
    }
};
module.exports = EmojiExtension;
