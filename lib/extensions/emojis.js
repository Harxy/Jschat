var emoji = require("node-emoji"),
    extensionHelper = require("./extension-helper.js");

var availableEmojiString = Object.keys(emoji.emoji).join(", ");

var EmojiExtension = function(keyword) {
    return {
        incoming: function(message, callback) {
            var keywordMatched = extensionHelper.CheckMessageForKeyword(message, keyword, false);
            
            if (keywordMatched === null) {
                callback(message);
                return;
            }
            
            if (keywordMatched) {
                message.data.text = availableEmojiString;
            } else {
                message.data.text = emoji.emojify(message.data.text);
            }

            callback(message);
        }
    };
};
module.exports = EmojiExtension;