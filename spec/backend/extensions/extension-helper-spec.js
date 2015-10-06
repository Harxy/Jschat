extensionHelper = require("../../../lib/extensions/extension-helper.js");
var messageHelper = require("../../helpers/message-helper.js");

var messageWithText = messageHelper.messageWithText;
var messageWithoutText = messageHelper.messageWithoutText;

describe("The extension helper provides a CheckMessageForKeyword function which", function() {
    var checkMessageForKeyword = extensionHelper.CheckMessageForKeyword;
    
    it("returns null if the message is a faye message and does not contain message text", function () {
        var message = messageWithoutText();
        expect(checkMessageForKeyword(message, "cat", true)).toBe(null);
    });

    it("returns false if the message does not begin with a keyword when expecting a parameter", function() {
        var message = messageWithText("I am the first test message");
        expect(checkMessageForKeyword(message, "cat", true)).toBe(false);
    });
    
    it("returns false if the message does not begin with a keyword when not expecting a parameter", function () {
        var message = messageWithText("I am the first test message");
        expect(checkMessageForKeyword(message, "cat", false)).toBe(false);
    });

    it("returns true if the message matches a keyword when not expecting a parameter", function () {
        var message = messageWithText("keyword me");
        expect(checkMessageForKeyword(message, "keyword me", false)).toBe(true);
    });
    
    it("returns false if the message begins with a keyword when not expecting a parameter", function () {
        var message = messageWithText("keyword me parameter");
        expect(checkMessageForKeyword(message, "keyword me", false)).toBe(false);
    });

    it("returns the value of the parameter if the message begins with a keyword when expecting a parameter", function () {
        var message = messageWithText("keyword me parameter");
        expect(checkMessageForKeyword(message, "keyword me", true)).toBe("parameter");
    });

    it("returns the value of the parameter excluding any leading or trailing spaces if the message begins with a keyword when expecting a parameter", function () {
        var message = messageWithText("keyword me      parameter here        ");
        expect(checkMessageForKeyword(message, "keyword me", true)).toBe("parameter here");
    });

    it("returns the value of the parameter excluding any leading or trailing spaces if the message begins with a keyword when expecting a parameter", function () {
        var message = messageWithText("keyword me      parameter here        ");
        expect(checkMessageForKeyword(message, "keyword me", true)).toBe("parameter here");
    });

    it("returns the a URL parameter if the message begins with a keyword when expecting a parameter", function () {
        var message = messageWithText("keyword me https://www.youtube.com/watch?v=tXcgt6l_LcA");
        expect(checkMessageForKeyword(message, "keyword me", true)).toBe("https://www.youtube.com/watch?v=tXcgt6l_LcA");
    });
});
