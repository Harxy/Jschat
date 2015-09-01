var http = require('http'),
    static = require('node-static'),
    Faye = require('faye');

    var port = process.env.PORT || 8001;

var bayeux = new Faye.NodeAdapter({mount: '/faye', timeout: 5 });

var file = new(static.Server)('.');

var server = http.createServer(function(request, response) {
    request.addListener('end', function() {
        file.serve(request, response);
    });
  });

bayeux.attach(server);
server.listen(port);
