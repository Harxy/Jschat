var linkRegex = /((https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?)/gi;
var imageLinkRegex = /(<a[^>]+>)([^<]+\.(png|gif|jpg))<\/a>/gi;
var roomMeRegex = /( |^)#([A-Za-z0-9_-]+)(?![A-Za-z0-9_\]-])/g;

var linkifyUrls = function(text) {
    return text.replace(linkRegex, "<a href='$1' target='_blank'>$1</a>");
};
var imagifyLinks = function(text) {
    return text.replace(imageLinkRegex, "$1<img src='$2' /></a>");
};
var roomifyLinks = function(text) {
  return text.replace(roomMeRegex, "$1<a href='/rooms/$1'>#$2</a>");
};

var AutoHtmlExtension = {
    incoming: function (message, callback) {
        if (!message.data || !message.data.text) {
            callback(message);
            return;
        }
        message.data.text = linkifyUrls(message.data.text);
        message.data.text = imagifyLinks(message.data.text);
        message.data.text = roomifyLinks(message.data.text);
        callback(message);
    }
};
module.exports = AutoHtmlExtension;
