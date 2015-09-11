var loadDataStore = function(env) {
    var dataStore;
    if (env.REDIS_URL) {
        var client = require('redis').createClient(env.REDIS_URL);
        var redisStorage = require('./redis-messages');
        dataStore = redisStorage.new(client, 30);
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