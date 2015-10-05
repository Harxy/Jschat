var userNameField;
var roomNameField;
var messageField;

var nowPlayingUserField;
var nowPlayingTitleField;

var youtubeContainer;

var roomIsMuted;

$(function () {
    userNameField = $("#name");
    roomNameField = $("#room-name");
    messageField = $("#input");
    
    nowPlayingUserField = $("#now-playing-user");
    nowPlayingTitleField = $("#now-playing-title");
    
    youtubeContainer = $('.youtube-container');

    var client = new Faye.Client("/faye");
    var roomName = getRoomNameFromUrl();
    var userName = getLastUsername();
    userNameField.val(userName);
    roomNameField.text(roomName);
    $('title').html('#' + roomName);

    loadHistory(roomName);
    setLastRoomName(roomName);
    getRecentRoomNames();

    CHABBLE.ChatClient.Init(client, roomName, userName);
    CHABBLE.ChatClient.OnNewMessageReceived(newMessageReceived);
    CHABBLE.ChatClient.OnHearbeatReceived(heartbeatReceived);
    CHABBLE.ChatClient.OnMediaRequestRecieved(mediaRequestRecieved);
    
    messageField.keyup(function(e) {
        var message = messageField.val();
        if (e.keyCode === 13 && message != null && message != "") {
            CHABBLE.ChatClient.SendMessage(message);
            messageField.val("");
        }
    });

    userNameField.on("blur", function() {
        CHABBLE.ChatClient.SetUsername(userNameField.val());
        createCookie("username", userNameField.val(), 30);
    });

    messageField.focus();

    $("#mute-audio").on('click', function () {
        if (roomIsMuted) {
            $(this).removeClass('glyphicon-volume-off');
            $(this).addClass('glyphicon-volume-up');
            CHABBLE.YouTubeClient.UnMute();
        } else {
            $(this).removeClass('glyphicon-volume-up');
            $(this).addClass('glyphicon-volume-off');
            CHABBLE.YouTubeClient.Mute();
        }

        roomIsMuted = !roomIsMuted;
    });

    CHABBLE.YouTubeClient.OnVideoFinished(function () {
        hideYoutubePlayer();
    });

    CHABBLE.YouTubeClient.Init();

});

function playYoutubeVideo(videoId, offset, user, title) {
    youtubeContainer.show(250);
    setNowPlaying(user, title);
    CHABBLE.YouTubeClient.Play(videoId, offset);
}

function hideYoutubePlayer() {
    CHABBLE.YouTubeClient.Stop();
    youtubeContainer.hide(250);
    setNowPlaying('Nobody', 'anything');
}

function setNowPlaying(name, title) {
    nowPlayingUserField.text(name);
    nowPlayingTitleField.text(title);
}

function mediaRequestRecieved(service, id, offset, user, title) {
    if (service === 'youtube') {
        playYoutubeVideo(id, offset, user, title);
    }
}

function getRoomNameFromUrl() {
    var roomArray = window.location.pathname.split("/");
    var roomName = roomArray[2];
    if (!roomName)
        roomName = "welcome";

    return roomName;
}

function getLastUsername() {
    var storedUsername = readCookie("username");
    if (!storedUsername)
        storedUsername = "Anon";

    return storedUsername;
}

function heartbeatReceived(users) {
    var userBlock = $(".user-list");
    userBlock.show(250);

    var userList = userBlock.find(".online-users ul");
    userList.empty();
    $.each(users, function(key, user) {
        var cleanedName = $('<div/>').html(user).text();
        userList.append("<li>" + cleanedName + "</li>");
    });
};

function newMessageReceived(name, message, timeString) {
    addToScreen(name, message, timeString);
    $.titleAlert("New!", {
        requireBlur: true,
        stopOnFocus: true,
        interval: 700
    });
};


function addToScreen(name, message, timeString) {
    if (twemoji.parse) {
        message = twemoji.parse(message, { size: 16 });
    }
    var cleanedName = $('<div/>').html(name).text();
    var $newMessage = $("<div class=\"message\"></div>")
        .append("<div class=\"name\">" + cleanedName + "<span>" + timeString + "</span></div>")
        .append("<div class=\"body\">" + message + "</div>");
    $("#output").prepend($newMessage);
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

/* Helpers */

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