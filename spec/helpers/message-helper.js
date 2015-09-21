var messageWithText = function(text) {
    return {
        channel: "/rooms/logging-test",
        data: {
            text: text
        }
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
exports.expectMessageToMatch = expectMessageToMatch;