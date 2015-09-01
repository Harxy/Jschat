var Faye = require('faye');

var client = new Faye.Client('http://localhost:8001/faye');

client.subscribe('/messages', function(message) {
  console.log('got a message: ' + message.text);

})
