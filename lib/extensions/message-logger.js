var MessageLogger = function(dataStore) {
    return {
        incoming: function (message, callback) {
            if (message.data && message.data.text) {
                var room = message.channel.slice(message.channel.lastIndexOf('/') + 1);
                dataStore.storeMessage(room, message);
            }

            callback(message);
        }
    };
};
module.exports = MessageLogger;
