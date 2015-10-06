var globalClient;
var redisClientForEnv = function (env) {
    if (!globalClient) {
        globalClient = require('redis').createClient(env.REDIS_URL);
    }
    return globalClient;
};

var loadMessageStore = function(env) {
    var dataStore;

    // REDIS is the preferred option. Heroku will have the REDIS_URL
    // set if this is available.
    if (env.REDIS_URL) {
        var client = redisClientForEnv(env);
        var redisStorage = require('./redis-messages');
        dataStore = redisStorage.new(client, 30);

    // If redis isn't available then node persist can store the messages
    // on the local file system
    } else {
        var nodePersist = require('node-persist');
        var nodePersistStorage = require('./node-persist-messages');
        nodePersist.initSync();
        dataStore = nodePersistStorage.new(nodePersist, 30);
    }
    return dataStore;
};

var loadPlayQueueStore = function(env) {
    var dataStore;

    // REDIS is the preferred option. Heroku will have the REDIS_URL
    // set if this is available.
    if (env.REDIS_URL) {
        var client = redisClientForEnv(env);
        dataStore = require('./redis-play-queue').start(client);
        // If redis isn't available then don't persist queues
    } else {
        dataStore = require('./null-play-queue').start();
    }
    return dataStore;
};

module.exports = {
    loadMessageStore: loadMessageStore,
    loadPlayQueueStore: loadPlayQueueStore
};