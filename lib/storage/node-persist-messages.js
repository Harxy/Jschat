var CreateMessageStorage = function(nodePersist, messagesToKeep){
    messagesToKeep = messagesToKeep || 30;
    return {
        "storeMessage": function (roomId, message) {
            var dataStoreId = 'messages.' + roomId;
            var currentMessages = nodePersist.getItem(dataStoreId);
            if (!currentMessages)
                currentMessages = [];

            currentMessages.unshift(message);
            nodePersist.setItem(dataStoreId, currentMessages.slice(0, messagesToKeep));
        },
        "loadMessages": function (roomId, callback) {
            var dataStoreId = 'messages.' + roomId;
            callback(nodePersist.getItem(dataStoreId));
        }
    };
};

module.exports = {
    "new": CreateMessageStorage
};