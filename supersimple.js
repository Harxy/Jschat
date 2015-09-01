var http = require('http');
var server = http.createServer(function(request,response){
  response.writeHead(200, {'Content-type' : 'text/plain'  });
  response.write("this is a test\n");

  setTimeout(function() {
  response.end("hello world");
}, 2000);
});


server.listen(7900);

console.log ("this server is running");
