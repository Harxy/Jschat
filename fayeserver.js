var server = require("./lib/app");

var heartBeat = require("./extensions/heart").new(bayeux.getClient());

bayeux.addExtension(heartBeat.extension);
var port = process.env.PORT || 8001;
server.listen(port);
console.log('listening on: ' + port);