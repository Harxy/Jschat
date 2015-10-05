var roomQueue = require("../../../lib/play-queue/room-queue");

var newExampleItem = function(itemData, itemRequester) {
    return {
        "data": itemData,
        "requester": itemRequester,
        "duration": 400
    };
};

describe("A single room queue that updates when told what the time is", function() {
    var queue, storage;

    beforeEach(function () {
        storage = require("../../../lib/storage/null-play-queue")
            .new('room-test');
        queue = roomQueue.new(storage);

        spyOn(storage, 'storeQueueUpNext');
        spyOn(storage, 'storeQueueCurrent');
    });

    afterEach(function() {
        storage.storeQueueUpNext.calls.reset();
        storage.storeQueueCurrent.calls.reset();
    });

    it("accepts items given to add", function() {
        var item = newExampleItem({}, "steve");
        expect(queue.add(item)).toBe(true);
    });

    it("queued items are stored", function() {
        var item = newExampleItem({}, "steve");
        queue.add(item);
        expect(queue.getAll()).toEqual([item]);
    });

    it("Queueing an item updates the storage", function() {
        var firstItem = newExampleItem({}, "oli");
        var secondItem = newExampleItem({}, "paul");

        queue.add(firstItem);
        expect(storage.storeQueueUpNext.calls.mostRecent().args)
            .toEqual([[firstItem]]);

        queue.add(secondItem);
        expect(storage.storeQueueUpNext.calls.mostRecent().args)
            .toEqual([[firstItem, secondItem]]);
    });

    it("can be checked if it's empty", function() {
        var item =newExampleItem({}, "steve");
        expect(queue.isEmpty()).toEqual(true);
        queue.add(item);
        expect(queue.isEmpty()).toEqual(false);
        queue.tick(3453495);
        expect(queue.isEmpty()).toEqual(false);
    });

    it("when a tick is received the first item in the queue is popped", function() {
        var first = newExampleItem({}, "steve");
        var second = newExampleItem({}, "zebra-steve");
        queue.add(first);
        queue.add(second);

        queue.tick(Date.now());

        // Only the second item should still be in the queue
        expect(queue.getAll()).toEqual([second]);
    });

    it("Starting to play the first item updates the persisted current state", function() {
        var item = newExampleItem({}, "steve");
        queue.add(item);

        var now = Date.now();
        queue.tick(now);

        var expectedCurrent = { data: {}, requester: 'steve', duration: 400, startTime: now };
        expect(storage.storeQueueCurrent.calls.mostRecent().args)
            .toEqual([expectedCurrent]);
    });


    it("Starting to play the first item updates the persisted pending queue", function() {
        var item = newExampleItem({}, "steve");
        queue.add(item);

        queue.tick(Date.now());

        var emptyQueue = [];
        expect(storage.storeQueueUpNext.calls.mostRecent().args)
            .toEqual([emptyQueue]);
    });

    it("returns null on ticks on an empty queue", function() {
        expect(queue.tick(1421092800)).toEqual(null);
    });

    it("when the first tick is received return data with a play offset of zero", function() {
        var itemData = {};
        var itemRequester = "steve";
        var item = newExampleItem(itemData, itemRequester);
        queue.add(item);

        var expectedResponse = {
            "data": itemData,
            "requester": itemRequester,
            "playOffset": 0
        };

        expect(queue.tick(1421092800)).toEqual(expectedResponse);
    });

    it("updates the play offset on later ticks", function() {
        var itemData = {};
        var itemRequester = "steve";
        var item = newExampleItem(itemData, itemRequester);
        queue.add(item);

        var startTime = 1421092800;
        var nextTickDelay = 100;
        queue.tick(startTime);

        var expectedResponse = {
            "data": itemData,
            "requester": itemRequester,
            "playOffset": nextTickDelay
        };

        expect(queue.tick(startTime + nextTickDelay)).toEqual(expectedResponse);
    });

    it("A tick passed the end-time will return null", function() {
        var itemData = {};
        var itemRequester = "steve";
        var item = newExampleItem(itemData, itemRequester);
        queue.add(item);

        var startTime = 1421092800;
        var nextTickDelay = 401;
        queue.tick(startTime);

        var expectedResponse = null;

        expect(queue.tick(startTime + nextTickDelay)).toEqual(expectedResponse);
    });

    it("After 5 seconds the next queue item is emited on tick ", function() {
        var itemOneData = {"name": "first"};
        var itemTwoData = {"name": "second"};
        var itemRequester = "steve";
        var itemOne = newExampleItem(itemOneData, itemRequester);
        var itemTwo = newExampleItem(itemTwoData, itemRequester);

        queue.add(itemOne);
        queue.add(itemTwo);

        var startTime = 1421092800;
        var pastFirstduration = 401;

        var expectedFirstResponse = {
            "data": itemOneData,
            "requester": itemRequester,
            "playOffset": 0
        };

        var expectedThirdResponse = {
            "data": itemTwoData,
            "requester": itemRequester,
            "playOffset": 0
        };

        expect(queue.tick(startTime)).toEqual(expectedFirstResponse);
        expect(queue.tick(startTime + pastFirstduration + 1000)).toEqual(null);
        expect(queue.tick(startTime + pastFirstduration + 3000)).toEqual(null);// still not 5 seconds
        expect(queue.tick(startTime + pastFirstduration + 5001)).toEqual(expectedThirdResponse);
    });

    it("After 5 seconds the current persisted state is cleared ", function() {
        var itemOneData = {"name": "first"};
        var itemRequester = "steve";
        var itemOne = newExampleItem(itemOneData, itemRequester);

        queue.add(itemOne);

        var startTime = 1421092800;
        queue.tick(startTime);

        var pastFirstduration = 401;
        queue.tick(startTime + pastFirstduration + 5001);
        expect(storage.storeQueueCurrent.calls.mostRecent().args)
            .toEqual([null]);

    });

});