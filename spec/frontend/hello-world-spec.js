var Browser = require('zombie');
Browser.localhost('localhost', 8001);

describe('Basic page load checks', function() {
    var browser, app;

    beforeEach(function() {
        browser = new Browser();
        app = require('../../lib/app').listen(8001);
    });

    afterEach(function() {
        app.close();
    });

    it('index loads', function() {
        browser.visit('/', function() {
            browser.assert.success();
            next();
        });
    });

    it('specic room loading works', function() {
        browser.visit('/rooms/dev', function() {
            browser.assert.success();
            next();
        });
    });

});