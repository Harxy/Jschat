var createNew = function(serverClient) {
    var roomRegex = /\/rooms\/([^\/]+)/i;
    return function(clientId, channel) {
       var roomData = roomRegex.exec(channel);
       if (!roomData) {
           return;
       }

       var roomName = roomData[1];
       if (roomName === "undefined") {
           roomName = "Welcome";
       }
       if (roomName && roomName !== "rooms") {
           serverClient.publish('/rooms/rooms', {
               text: "#" + roomName + " was joined",
               name: "Heimdallr",
               timeString: (new Date()).toTimeString().split(' ')[0]
           });
       }
   };
};
module.exports = {
    "new": createNew
};