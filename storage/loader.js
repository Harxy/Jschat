var loadDataStore = function(env) {
    var dataStore;

    // REDIS is the preferred option. Heroku will have the REDIS_URL
    // set if this is available.
    if (env.REDIS_URL) {
        var client = require('redis').createClient(env.REDIS_URL);
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

module.exports = {
    load: loadDataStore
};