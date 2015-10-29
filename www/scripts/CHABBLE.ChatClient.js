var CHABBLE = CHABBLE || {};

CHABBLE.ChatClient = (function() {
    var roomName = "";
    var userName = "";

    var roomUserList = [];

    var fayeClient;
    var heartbeatSendInterval = 10;

    var newMessageReceivedCallback;
    var heartbeatReceivedCallback;
    var mediaRequestReceivedCallback;

    function setUsername(username) {
        userName = username;
    }

    function subscribeToRoomMessages() {
        fayeClient.subscribe("/rooms/" + roomName, function(message) {
            if (typeof newMessageReceivedCallback !== "undefined")
                newMessageReceivedCallback(message.name, message.text, message.recipient, message.timeString);
        });
    }

    function subscribeToRoomMediaRequests() {
        fayeClient.subscribe("/media/" + roomName, function(message) {
            if (typeof mediaRequestReceivedCallback !== "undefined")
                mediaRequestReceivedCallback(message.service, message.id, message.offset, message.user, message.title);
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

            if (typeof heartbeatReceivedCallback !== "undefined")
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
            subscribeToRoomMessages();
            subscribeToRoomHeartbeats();
            subscribeToRoomMediaRequests();

        },
        SetUsername: function(username) {
            setUsername(username);
        },
        OnNewMessageReceived: function(callback) {
            newMessageReceivedCallback = callback;
        },
        OnHearbeatReceived: function(callback) {
            heartbeatReceivedCallback = callback;
        },
        SendMessage: function(message) {
            sendMessage(message);
        },
        OnMediaRequestRecieved: function(callback) {
            mediaRequestReceivedCallback = callback;
        }
    };
})();