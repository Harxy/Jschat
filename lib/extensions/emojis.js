var emoji = require("node-emoji");

var availableEmojiString = Object.keys(emoji.emoji).join(", ");

var EmojiExtension = {
    incoming: function (message, callback) {
        if (message.data && message.data.text) {
            if (message.data.text == "emoji me") {
                message.data.text = availableEmojiString;
            } else {
                message.data.text = emoji.emojify(message.data.text);
            }
        }
        callback(message);
    }
};
module.exports = EmojiExtension;
