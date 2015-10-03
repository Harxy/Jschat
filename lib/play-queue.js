var roomQueue = require("./play-queue/room-queue");

var isValidQueueItem = function (item) {
    return item.data && item.duration && item.requester;
};

var roomQueueFactory = function() {
    return roomQueue.new();
};

var createNew = function(client) {
    var roomQueues = {};

    var clearEmptyRooms = function () {
        Object.keys(roomQueues).filter(function (roomName) {
            return roomQueues[roomName].isEmpty();
        }).forEach(function (roomName) {
            delete roomQueues[roomName];
        });
    };

    var messageEachRoom = function () {
        Object.keys(roomQueues).forEach(function (roomName) {
            var queue = roomQueues[roomName];
            var playing = queue.tick(Date.now());
            if (playing) {
                console.log(roomName);
                console.log(playing);
            }
        });
    };
    var tick = function() {
        clearEmptyRooms();
        messageEachRoom();
    };

    // Finds/Creates a queue for the oom then adds the
    // item.
    var queueItem = function(room, item) {
        if (!isValidQueueItem(item)) {
            return false;
        }
        if (!roomQueues[room]) {
            roomQueues[room] = roomQueueFactory();
        }
        roomQueues[room].add(item);
        return true;
    };

    setInterval(tick, 100);
    return {
        "queueItem": queueItem
    };
};

module.exports = {
    "new": createNew
};
