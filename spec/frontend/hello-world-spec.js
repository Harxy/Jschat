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

    it('index loads', function(done) {
        browser.visit('/', function() {
            browser.assert.success();
            done();
        });
    });

    it('specic room loading works', function(done) {
        browser.visit('/rooms/dev', function() {
            browser.assert.success();
            done();
        });
    });

});