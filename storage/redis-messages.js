var CreateMessageStorage = function(redis, messagesToKeep) {
    var roomLife = 3 * 60 * 60 * 24; // 3 days
    messagesToKeep = messagesToKeep || 30;
    var loadMessages = function (roomId, callback) {
        var dataStoreId = 'messages.' + roomId;
        redis.get(dataStoreId, function(err, reply) {
            callback(JSON.parse(reply) || []);
        });
        redis.expire(dataStoreId, roomLife);
    };
    return {
        "storeMessage": function (roomId, message) {
            loadMessages(roomId, function(currentMessages) {
                var dataStoreId = 'messages.' + roomId;
                currentMessages.unshift(message);
                redis.set(
                    dataStoreId,
                    JSON.stringify(currentMessages.slice(0, messagesToKeep))
                );
            });
        },
        "loadMessages": loadMessages
    };
};

module.exports = {
    "new": CreateMessageStorage
};