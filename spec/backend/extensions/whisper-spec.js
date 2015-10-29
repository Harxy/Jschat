var whisperExtension = require("../../../lib/extensions/whisper.js");
var messageHelper = require("../../helpers/message-helper.js");

var customMessageMatchers = messageHelper.custom_matchers;
var messageWithText = messageHelper.messageWithText;

describe("The whisper extension takes sets the recipient of the message if the author has sepcified one", function() {
    var handler;

    beforeEach(function() {
        jasmine.addMatchers(customMessageMatchers);
        handler = whisperExtension.incoming;
    });

    it("leaves a non-whsipered message unchanged", function(done) {
        var message = messageWithText("I'm a little message and I'm okay");
        var expectedMessage = messageWithText("I'm a little message and I'm okay");
        handler(message, function(updatedMessage) {
            expect(updatedMessage).toMatchMessage(expectedMessage);
            done();
        });
    });

    it("sets recipient when message is whispered", function (done) {
        var message = messageWithText("~Username~I'm a little message and I'm okay");
        var expectedMessage = messageWithText("I'm a little message and I'm okay")
        expectedMessage.data.recipient = "Username";
        handler(message, function (updatedMessage) {
            expect(updatedMessage).toMatchMessage(expectedMessage);
            done();
        });
    });
});
