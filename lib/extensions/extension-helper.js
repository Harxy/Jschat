var ExtensionHelper = {
    CheckMessageForKeyword: function(message, keyword, hasParameters) {
        if (!message.data || !message.data.text) {
            return null;
        }

        var keywordRegex;

        if (hasParameters) {
            keywordRegex = new RegExp("^\\s*" + keyword + "\\s*(\\S.+?)\\s*$", "i");
            var params = message.data.text.match(keywordRegex);

            if (params === null) {
                return false;
            }

            return params[1];
        } else {
            keywordRegex = new RegExp("^\\s*" + keyword + "\\s*$", "i");
            var matched = keywordRegex.test(message.data.text);
            return matched;
        }
    }
};

module.exports = ExtensionHelper;