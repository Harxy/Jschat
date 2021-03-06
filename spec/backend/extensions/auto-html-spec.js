autoHtmlExtension = require("../../../lib/extensions/auto-html");
var messageHelper = require("../../helpers/message-helper.js");

var messageWithText = messageHelper.messageWithText;
var customMessageMatchers = messageHelper.custom_matchers;

describe("The auto html provides an incoming handler", function() {
    var handler = autoHtmlExtension.incoming;

    beforeEach(function() {
        jasmine.addMatchers(customMessageMatchers);
    });

    it("leaves basic messages unchanged", function(done) {
        var message = messageWithText("I'm a little message and I'm okay");
        var expectedMessage = messageWithText("I'm a little message and I'm okay");
        handler(message, function(updatedMessage) {
            expect(updatedMessage).toMatchMessage(expectedMessage);
            done();
        });
    });

    it("creates anchor tags out of links", function(done) {
        var message = messageWithText("go to http://www.fun.com");
        var expectedMessage = messageWithText(
            "go to <a href='http://www.fun.com' target='_blank'>http://www.fun.com</a>"
        );
        handler(message, function(updatedMessage) {
            expect(updatedMessage).toMatchMessage(expectedMessage);
            done();
        });
    });

    it("it leaves quoted links alone", function(done) {
        var message = messageWithText("go to 'http://www.fun.com'");
        var expectedMessage = messageWithText("go to 'http://www.fun.com'");
        handler(message, function(updatedMessage) {
            expect(updatedMessage).toMatchMessage(expectedMessage);
            done();
        });
    });

    it("makes .gif links images", function(done) {
        var message = messageWithText("http://www.fun.com/lol.gif");
        var expectedMessage = messageWithText(
            "<a href='http://www.fun.com/lol.gif' target='_blank'><img src='http://www.fun.com/lol.gif' /></a>"
        );
        handler(message, function(updatedMessage) {
            expect(updatedMessage).toMatchMessage(expectedMessage);
            done();
        });
    });

    it("creates portals when room link is only content on line", function(done) {
        var message = messageWithText("#hello");
        var expectedMessage = messageWithText(
            ":: portal opened to <a href='/rooms/hello'>#hello</a> (<a href='/rooms/hello' target='_blank'>in a new window</a>) ::"
        );
        handler(message, function(updatedMessage) {
            expect(updatedMessage).toMatchMessage(expectedMessage);
            done();
        });
    });

});
