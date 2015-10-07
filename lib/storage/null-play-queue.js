var start = function() {
    var CreatePlayQueueStorage = function(queueName) {
        return {
            storeQueueCurrent: function(current) {
                //forget it
            },
            storeQueueUpNext: function(upNext) {
                //forget it
            },
            loadRememberQueueState: function(callback) {
                // again I know nothing
                // state, queue
                callback(null, []);
            }
        };
    };
    return {
        "new": CreatePlayQueueStorage,
        "loadAllRememberedQueues": function (callback) {
            // array of queue names remembered
            callback([]);
        }
    };
};

module.exports = {
    "start": start
};