var CreateMessageStorage = function(redis){
    var messagesToKeep = 30;
    return {
        "storeMessage": function (roomId, message) {
            var dataStoreId = 'messages.' + roomId;
            redis.get(dataStoreId, function(err, reply) {
                if (!reply) {
                    var currentMessages = [];
                } else {
                    var currentMessages = JSON.parse(reply);
                }

                currentMessages.unshift(message);
                redis.set(
                    dataStoreId,
                    JSON.stringify(currentMessages.slice(0, messagesToKeep))
                );
            });
        },
        "loadMessages": function (roomId, callback) {
            var dataStoreId = 'messages.' + roomId;
            redis.get(dataStoreId, function(err, reply) {
                callback(JSON.parse(reply));
            });
        }
    };
};

module.exports = {
    "new": CreateMessageStorage
};