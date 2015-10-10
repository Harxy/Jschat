var App = require('../../lib/app');
var webdriverio = require('webdriverio');

var client = webdriverio.remote({
    desiredCapabilities: {
        browserName: 'phantomjs'
    },
    port: 4445,
    logLevel: 'silent'
});
var port = 8002;
var baseUrl = 'http://localhost:' + port + '/';

describe('Basic page load checks', function() {
    var app;

    beforeEach(function() {
        app = App.create().listen(port);
        client = client.init();
    });

    afterEach(function() {
        app.close();
        client = client.end();
    });

    it('index loads', function(done) {
        client
            .url(baseUrl)
            .getTitle().then(function(title) {
                expect(title).toEqual("#welcome");
                done();
            });
    });

    it('loads the devs room', function(done) {
        client
            .url(baseUrl + "rooms/devs")
            .getTitle().then(function(title) {
                expect(title).toEqual("#devs");
                done();
            });
    });

});