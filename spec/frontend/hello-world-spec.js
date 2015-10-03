var Browser = require('zombie');
Browser.localhost('localhost', 8001);
var App = require('../../lib/app');

describe('Basic page load checks', function() {
    var browser, app;

    beforeEach(function() {
        browser = new Browser();
        app = App.create().listen(8001);
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

    it('specific room loading works', function(done) {
        browser.visit('/rooms/dev', function() {
            browser.assert.success();
            done();
        });
    });
});