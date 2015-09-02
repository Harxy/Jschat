var    http = require('http'),
       Faye = require('faye');

var server = http.createServer();

var bayeux = new Faye.NodeAdapter({ mount: '/faye', timeout: 5 });

bayeux.attach(server);

var port = process.env.PORT || 8001;
server.listen(port);

console.log('listening on: ' + port);
