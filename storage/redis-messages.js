var CreateMessageStorage = function(redis, messagesToKeep) {
    var roomLife = 3 * 60 * 60 * 24; // 3 days
    messagesToKeep = messagesToKeep || 30;
    var inMemoryStorage = {};

    var loadMessages = function (roomId, callback) {
        var dataStoreId = 'messages.' + roomId;
        if (inMemoryStorage[dataStoreId]) {
            callback(inMemoryStorage[dataStoreId]);
            return;
        }
        redis.get(dataStoreId, function(err, reply) {
            var messages = JSON.parse(reply) || [];
            inMemoryStorage[dataStoreId] = messages;
            callback(messages);
        });
        redis.expire(dataStoreId, roomLife);
    };

    var storeMessage = function (roomId, message) {
        var dataStoreId = 'messages.' + roomId;
        loadMessages(roomId, function(currentMessages) {
            currentMessages.unshift(message);
            var trimmedMessages = currentMessages.slice(0, messagesToKeep);
            inMemoryStorage[dataStoreId] = trimmedMessages;
            redis.set(
                dataStoreId,
                JSON.stringify(trimmedMessages)
            );
        });
    };

    return {
        "storeMessage": storeMessage,
        "loadMessages": loadMessages
    };
};

module.exports = {
    "new": CreateMessageStorage
};