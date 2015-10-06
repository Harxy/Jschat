var start = function(redis) {
    var redisPrefix = "playqueue-storage";
    var ttl = 60 * 60; // store for an hour
    var queueListKey = redisPrefix + "-allqueues";

    var CreatePlayQueueStorage = function(queueName) {
        var queueKey = redisPrefix + "-data-" + queueName;

        var rememberQueueName = function() {
            redis.hset(
                queueListKey,
                queueName,
                "1"
            );
            redis.expire(queueKey, ttl);
        };
        return {
            storeQueueCurrent: function(current) {
                redis.hset(
                    queueKey,
                    'current',
                    JSON.stringify(current)
                );
                redis.expire(queueKey, ttl);
                rememberQueueName();
            },
            storeQueueUpNext: function(upNext) {
                redis.hset(
                    queueKey,
                    'upnext',
                    JSON.stringify(upNext)
                );
                redis.expire(queueKey, ttl);
                rememberQueueName();
            },
            loadRememberQueueState: function(callback) {
                redis.hgetall(queueKey, function (err, data) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    callback(
                        data.current || null,
                        data.upnext || []
                    );
                });
            }
        };
    };

    return {
        "new": CreatePlayQueueStorage,
        "loadAllRememberedQueues": function (callback) {
            redis.hgetall(queueListKey, function (err, data) {
                if (err) {
                    console.log(err);
                    return;
                }
                callback(Object.keys(data));
            });
        }
    };
};


module.exports = {
    "start": start
};