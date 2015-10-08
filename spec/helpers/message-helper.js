var messageWithText = function(text) {
    return {
        channel: "/rooms/logging-test",
        data: {
            text: text,
            name: 'Mctest'
        }

    };
};

var messageWithoutText = function () {
    return {
        channel: "/system/thing",
    };
};

var getMessageText = function(message) {
    return message.data.text;
};

var expectMessageToMatch = function (updatedMessage, expectedMessage) {
    console.log('expectMessageToMatch deprecated. Use: expect(updatedMessage).toMatchMessage instead.');
    expect(getMessageText(updatedMessage))
        .toBe(getMessageText(expectedMessage));
};

var custom_mactchers = {
    toMatchMessage: function(util, customEqualityTesters) {
        return {
            compare: function(actual, expected) {
                var result = {};
                //TODO: match more than text
                var actualText = getMessageText(actual);
                var expectedText = getMessageText(expected);
                result.pass = util.equals(actualText, expectedText, customEqualityTesters);
                if (!result.pass) {
                    result.message = "Expected message content: '" + expectedText +
                        "' but got: '" + actualText + "'";
                }
                return result;
            }
        };
    }
};

// Public export
exports.messageWithText = messageWithText;
exports.messageWithoutText = messageWithoutText;
exports.expectMessageToMatch = expectMessageToMatch;
exports.custom_mactchers = custom_mactchers;