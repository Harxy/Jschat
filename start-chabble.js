var server = require("./lib/app").create();


var port = process.env.PORT || 8001;
server.listen(port);
console.log('listening on: ' + port);