var validItem = function(item) {
    return item.data && item.duration && item.requester;
};

var createNew = function() {
    var items = [];
    var playingItem;
    var changeOverTime = 5000; // 5 seconds between tracks

    var add = function (item) {
        if (!validItem(item)) {
            return false;
        }
        items.push(item);
        return true;
    };
    var getAll = function () {
        return items;
    };
    var tick = function(currentTime) {
        // TODO: refactor the slightly complicated logic here
        var currentOffset;
        if (playingItem) {
            currentOffset = currentTime - playingItem.startTime;
            if (currentOffset > playingItem.duration + changeOverTime) {
                playingItem = null;
            } else if(currentOffset > playingItem.duration) {
                return null;
            }
        }
        if (!playingItem && items.length > 0) {
            playingItem = items[0];
            playingItem.startTime = currentTime;
            items = items.slice(1);
        }
        if (playingItem) {
            currentOffset = currentTime - playingItem.startTime;
            return {
                "data":       playingItem.data,
                "requester":  playingItem.requester,
                "playOffset": currentOffset
            };
        }
        return null;
    };

    return {
        'add'    : add,
        'getAll' : getAll,
        'isEmpty': function() { return !playingItem && items.length === 0;},
        'tick'   : tick
    };
};

module.exports = {
    "new": createNew
};
