var emoji = require("node-emoji");


var EmojiExtension = {
    incoming: function (message, callback) {
        if (message.data && message.data.text) {
            if (message.data.text == "emoji me") {
                message.data.text = Object.keys(emoji.emoji).join(", ");
            } else {
                message.data.text = emoji.emojify(message.data.text);
            }
        }
        callback(message);
    }
};
module.exports = EmojiExtension;
