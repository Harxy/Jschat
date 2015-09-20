var createNew = function(messageStore) {
    var serveHistory = function (request, response) {
        var room = request.url.slice(request.url.lastIndexOf('/') + 1);
        if (!room)
            room = 'Welcome';
        messageStore.loadMessages(room, function (messages) {
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify(messages));
        });
    };
    return {
        "serve": serveHistory
    };
};
module.exports = {
    "new": createNew
};