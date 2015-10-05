var roomQueue = require("./play-queue/room-queue");

var isValidQueueItem = function (item) {
    return item.data && item.duration && item.requester;
};

var createNew = function(client, queueStorage) {
    queueStorage = queueStorage || require("./storage/null-play-queue");
    var roomQueues = {};

    var roomQueueFactory = function(room) {
        storage = queueStorage.new('room' + room);
        return roomQueue.new(storage);
    };

    var clearEmptyRooms = function () {
        Object.keys(roomQueues).filter(function (roomName) {
            return roomQueues[roomName].isEmpty();
        }).forEach(function (roomName) {
            delete roomQueues[roomName];
        });
    };

    var messageRoom = function (roomName) {
        var queue = roomQueues[roomName];
        var playing = queue.tick(Date.now());
        if (playing) {
            var message = {
                service: playing.data.service || "unknown",
                id: playing.data.id || null,
                offset: Math.floor(playing.playOffset / 1000),
                user: playing.requester,
                title: playing.data.title || "unknown"
            };
            client.publish("/media/" + roomName, message);
        }
    };

    var messageEachRoom = function () {
        Object.keys(roomQueues).forEach(messageRoom);
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
            roomQueues[room] = roomQueueFactory(room);
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
