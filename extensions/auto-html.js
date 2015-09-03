var linkRegex = /((https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?)/gi;
var linkifyUrls = function(text) {
    return text.replace(linkRegex, "<a href='$1' target='_blank'>$1</a>");
};

var AutoHtmlExtension = {
    incoming: function (message, callback) {
        if (!message.data || !message.data.text) {
            callback(message);
            return;
        }
        message.data.text = linkifyUrls(message.data.text);
        callback(message);
    }
};
module.exports = AutoHtmlExtension;
