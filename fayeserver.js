var http = require('http'),
    static = require('node-static');
    Faye = require('faye');

    var port = process.env.PORT || 8001;

var file = new(static.Server)('.');

var server = http.createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    });
  });

var bayeux = new Faye.NodeAdapter({mount: '/faye', timeout: 5 });

bayeux.attach(server);
server.listen(port);
