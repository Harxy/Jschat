var serviceHelperExtension = require("../../../lib/extensions/service-helper.js");
var messageHelper = require("../../helpers/message-helper.js");

var messageWithText = messageHelper.messageWithText;

describe("test getService function", function() {
    it ('can take a standard youtube url and determine it is youtube', function() {
        var url = 'www.youtube.com/watch?v=4sRxtvygyDo';
        console.log(serviceHelperExtension.getService('hello'));
        expect(serviceHelperExtension.getService(url)).toBe('youtube');
    });




});
