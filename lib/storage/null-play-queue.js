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

module.exports = {
    "new": CreatePlayQueueStorage,
    "getAllRememberedQueues": function (callback) {
        // much like john snow I know nothing
        // {
        //   "queue-name": queueStorage
        // }
        callback({});
    }
};