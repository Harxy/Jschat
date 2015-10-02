var CHABBLE = CHABBLE || {};

CHABBLE.ChatClient = (function() {
    var roomName = "";
    var userName = "";

    var roomUserList = [];

    var fayeClient;
    var heartbeatSendInterval = 10;

    var newMessageReceivedCallback;
    var heartbeatReceivedCallback;


    function setUsername(username) {
        userName = username;
    }


    function subscribeToRoom() {
        fayeClient.subscribe("/rooms/" + roomName, function(message) {
            newMessageReceivedCallback(message.name, message.text, message.timeString);
        });
    }

    function sendMessage(message) {
        var time = new Date();
        var timeString = time.toTimeString().split(" ")[0];

        fayeClient.publish("/rooms/" + roomName, {
            text: message,
            name: userName,
            timeString: timeString
        });
    }


    function subscribeToRoomHeartbeats() {
        fayeClient.subscribe("/heartbeat_listen/" + roomName, function(message) {
            var userList = [];
            $.each(message, function(key, user) {
                userList.push(user.name);
            });

            roomUserList = userList;

            heartbeatReceivedCallback(roomUserList);
        });
    }

    function sendHeartbeat() {
        fayeClient.publish("/heartbeat_push/", {
            username: userName,
            room: roomName
        });

        setTimeout(function() {
            sendHeartbeat();
        }, heartbeatSendInterval * 1000);
    }


    return {
        Init: function(lClient, lRoomName, lUserName) {
            fayeClient = lClient;
            roomName = lRoomName;
            userName = lUserName;

            sendHeartbeat();
        },
        SetUsername: function(username) {
            setUsername(username);
        },
        NewMessageReceived: function(callback) {
            newMessageReceivedCallback = callback;
            subscribeToRoom();
        },
        HearbeatReceived: function(callback) {
            heartbeatReceivedCallback = callback;
            subscribeToRoomHeartbeats();
        },
        SendMessage: function(message) {
            sendMessage(message);
        }
    };
})();