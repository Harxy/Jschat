var userName;

$(function() {
    var roomArray = window.location.pathname.split("/");
    var roomName = roomArray[2];
    if (!roomName)
        roomName = "welcome";

    $("#room-name").html(roomName);

    $('title').html('#' + roomName)
    var client = new Faye.Client("/faye");
    getLastUsername();

    subscribeToRoom(client, roomName);
    subscribeToRoomHeartbeats(client, roomName);
    loadHistory(roomName);

    setLastRoomName(roomName);
    getRecentRoomNames();

    var $input = $("#input");
    var $name = $("#name");
    $input.keyup(function(e) {
        var message = $input.val();
        userName = $name.val();
        if (e.keyCode === 13 && message != null && message != "") {
            sendMessage(client, roomName, message);
            $input.val("");
        }
    });
    $input.focus();
    $name.on("blur", function() {
        setUsername($name.val());
    });

    sendHeartbeat(client, roomName);

    $(".about-chabble").popover({
        content: $(".about-chabble-message").html(),
        trigger: "click",
        html: true,
        placement: "left",
        container: "body"
    });

});


function sendHeartbeat(client, room) {
    client.publish("/heartbeat_push/", {
        username: userName,
        room: room
    });

    setTimeout(function() {
        sendHeartbeat(client, room);
    }, 10 * 1000);
}

function getLastUsername() {
    var storedUsername = readCookie("username");
    if (!storedUsername)
        storedUsername = "Anon";

    setUsername(storedUsername);
}

function setUsername(username) {
    userName = username;
    createCookie("username", userName, 30);

    var $name = $("#name");
    $name.val(userName);
}


function subscribeToRoom(client, roomName) {
    client.subscribe("/rooms/" + roomName, function(message) {
        addToScreen(message.name, message.text, message.timeString);
        $.titleAlert("New!", {
            requireBlur: true,
            stopOnFocus: true,
            interval: 700
        });
    });

}

function subscribeToRoomHeartbeats(client, roomName) {
    client.subscribe("/heartbeat_listen/" + roomName, function(message) {
        updateUserList(message);
    });

}

function sendMessage(client, roomName, message) {
    var time = new Date();
    var timeString = time.toTimeString().split(" ")[0];

    client.publish("/rooms/" + roomName, {
        text: message,
        name: userName,
        timeString: timeString
    });


}

function loadHistory(roomName) {
    $.getJSON("/history/" + roomName, function(messages) {
        messages.reverse();
        $.each(messages, function(key, message) {
            addToScreen(
                message.data.name,
                message.data.text,
                message.data.timeString
            );
        });
    });
}

function addToScreen(name, message, timeString) {
    if (twemoji.parse) {
        message = twemoji.parse(message, { size: 16 });
    }

    var $newMessage = $("<div class=\"message\"></div>")
        .append("<div class=\"name\">" + name + "<span>" + timeString + "</span></div>")
        .append("<div class=\"body\">" + message + "</div>");
    $("#output").prepend($newMessage);
}

function updateUserList(users) {
    var userBlock = $(".user-list");
    userBlock.show(250);

    var userList = userBlock.find(".online-users ul");
    userList.empty();
    $.each(users, function(key, user) {
        userList.append("<li>" + user.name + "</li>");
    });
}


function createCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function getRecentRoomNames() {
    var $lastRooms = $(".recent-rooms ul");
    var roomArray = [readCookie("lastRoom"), readCookie("secondRoom"), readCookie("thirdRoom")];
    for (var i = 0; i < roomArray.length; i++) {
        if (roomArray[i] != "undefined" && roomArray[i] != null)
            $lastRooms.append("<li><a href='/rooms/" + roomArray[i] + "'>#" + roomArray[i] + "</a></li>");
        else
            $lastRooms.append("");
    }

}

function setLastRoomName(roomName) {
    if (roomName != "undefined" && roomName !== null) {
        if (roomName != readCookie("lastRoom") && roomName != readCookie("secondRoom")) {
            createCookie("thirdRoom", readCookie("secondRoom"), 30);
            createCookie("secondRoom", readCookie("lastRoom"), 30);
            createCookie("lastRoom", roomName, 30);
        }
    }
}