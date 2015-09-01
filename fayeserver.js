var    statix = require('node-static'),
       http = require('http'),
       Faye = require('faye');



var bayeux = new Faye.NodeAdapter({mount: '/faye', timeout: 5 });

var file = new(statix.Server)('.');

var server = http.createServer(function(request, response) {
    console.log('accessing');
    request.addListener('end', function() {
        file.serve(request, response);
    }).resume();
  });
bayeux.attach(server);
var port = process.env.PORT || 8001;
server.listen(port);
console.log('listening on: ' + port);
