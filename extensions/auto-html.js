var linkRegex = /( |^)((https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?)/gi;
var imageLinkRegex = /(<a[^>]+>)([^<]+\.(png|gif|jpg))<\/a>/gi;
var roomMeRegex = /( |^)#([A-Za-z0-9_-]+)(?![A-Za-z0-9_\]-])/g;
var roomceptionRegex = /^roomcep(tion)? me #([A-Za-z0-9_-]+)(?![A-Za-z0-9_\]-])/gi;

var linkifyUrls = function(text) {
    return text.replace(linkRegex, "$1<a href='$2' target='_blank'>$2</a>");
};
var imagifyLinks = function(text) {
    return text.replace(imageLinkRegex, "$1<img src='$2' /></a>");
};
var roomception = function(text) {
    return text.replace(roomceptionRegex, '<iframe height="700" width="100%" src="/rooms/$2">');
};
var roomifyLinks = function(text) {
  return text.replace(roomMeRegex, "$1<a href='/rooms/$2'>#$2</a>");
};

var apply = function(initialText, funcs) {
    return funcs.reduce(function(text, funcToApply) {
        return funcToApply(text);
    }, initialText);
};

var AutoHtmlExtension = {
    incoming: function (message, callback) {
        if (!message.data || !message.data.text) {
            callback(message);
            return;
        }
        message.data.text = apply(message.data.text,[
            linkifyUrls,
            imagifyLinks,
            roomception,
            roomifyLinks
        ]);
        callback(message);
    }
};
module.exports = AutoHtmlExtension;
