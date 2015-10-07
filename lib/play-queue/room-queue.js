var validItem = function(item) {
    return item.data && item.duration && item.requester;
};

var createNew = function(storage) {
    var items = [];
    var playingItem;
    var changeOverTime = 5000; // 5 seconds between tracks
    var loading = false;

    var initFromStorage = function() {
        loading = true;
        storage.loadRememberQueueState(function(loadedCurrent, loadedItems){
            playingItem = loadedCurrent;
            items = loadedItems;
            loading = false;
        });
    };

    var add = function (item) {
        if (!validItem(item)) {
            return false;
        }
        items.push(item);
        storage.storeQueueUpNext(items);
        return true;
    };

    var getAll = function () {
        return items;
    };

    var deQueueNext = function (currentTime) {
        playingItem = items[0];
        playingItem.startTime = currentTime;
        storage.storeQueueCurrent(playingItem);
        items = items.slice(1);
        storage.storeQueueUpNext(items);
    };

    var livePlayResponse = function (currentTime) {
        var currentOffset = currentTime - playingItem.startTime;
        return {
            "data": playingItem.data,
            "requester": playingItem.requester,
            "playOffset": currentOffset
        };
    };

    var clearCurrent = function () {
        playingItem = null;
        storage.storeQueueCurrent(playingItem);
    };

    var tick = function(currentTime) {
        if (playingItem) {
            var currentOffset = currentTime - playingItem.startTime;
            if (currentOffset > playingItem.duration + changeOverTime) {
                clearCurrent();
            } else if(currentOffset > playingItem.duration) {
                // This is the pause between songs.
                return null;
            }
        }
        if (!playingItem && items.length > 0) {
            deQueueNext(currentTime);
        }
        if (playingItem) {
            return livePlayResponse(currentTime);
        }
        return null;
    };

    var isEmpty = function () {
        return !playingItem &&
            items.length === 0 &&
            !loading;
    };
    return {
        'initFromStorage': initFromStorage,
        'add'    : add,
        'getAll' : getAll,
        'isEmpty': isEmpty,
        'tick'   : tick
    };
};

module.exports = {
    "new": createNew
};
