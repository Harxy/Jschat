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
    expect(getMessageText(updatedMessage))
        .toBe(getMessageText(expectedMessage));
};

// Public export
exports.messageWithText = messageWithText;
exports.messageWithoutText = messageWithoutText;
exports.expectMessageToMatch = expectMessageToMatch;
