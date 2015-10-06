var queueMeExtension = require("../../lib/extensions/queue-me.js");
var messageHelper = require("../helpers/message-helper.js");

var messageWithText = messageHelper.messageWithText;

describe("test getService function", function() {
    it ('can take a standard youtube url and determine it is youtube', function() {
        var url = 'www.youtube.com/watch?v=4sRxtvygyDo';
        console.log(queueMeExtension.getService('hello'));
        expect(queueMeExtension.getService(url)).toBe('youtube');
    });




});
