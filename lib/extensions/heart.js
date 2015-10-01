var peopleInRoom = {};
var HeartBeatsExtension = {
    incoming: function (message, callback) {
        var now = Date.now();
        if (message.channel === '/heartbeat_push/') {
            var room = message.data.room;
            if (!peopleInRoom[room])
                peopleInRoom[room] = [];

            peopleInRoom[room] = peopleInRoom[room].filter(function(person) {
                return person.name !== message.data.username;
            });

            console.log("Adding: " + message.data.username);
            peopleInRoom[room].push({
                name: message.data.username,
                time: now
            });

        }
        callback(message);
    }
};

var createNew = function(client) {
    var killPeople = function() {
        var now = Date.now();
        Object.keys(peopleInRoom).forEach(function(room) {
            peopleInRoom[room] = peopleInRoom[room].filter(function (person) {
                return person.time > (now - (60 * 1000));
            });
            client.publish('/heartbeat_listen/' + room, peopleInRoom[room]);
        });
    };

    setInterval(killPeople, 2 * 1000);
    return {
        "extension": HeartBeatsExtension
    };
};

module.exports = {
    "new": createNew
};
