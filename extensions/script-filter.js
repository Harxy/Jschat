var Entities = require('html-entities').AllHtmlEntities;
entities = new Entities();

var putTheFunBackIn = function(text) {
    return text
        .replace(/&lt;marquee&gt;/ig, "<marquee>")
        .replace(/&lt;\/marquee&gt;/ig, "</marquee>");
};

var ScriptFilterExtension = {
    incoming: function (message, callback) {
        if (message.data && message.data.text) {
            message.data.text = entities.encode(message.data.text);
            message.data.text = putTheFunBackIn(message.data.text);
        }
        callback(message);
    }
};
module.exports = ScriptFilterExtension;
