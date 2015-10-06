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
            // much like john snow I know nothing
            // {
            //   "queue-name": queueStorage
            // }
            callback({});
        }
    };
};

module.exports = {
    "start": start
};