var userNameField;
var roomNameField;
var messageField;

var nowPlayingUserField;
var nowPlayingTitleField;

var youtubeContainer;

var muteAudioButton;
var roomAudioMuted;

var hideVideoButton;
var roomVideoHidden;

$(function () {
    userNameField = $("#name");
    roomNameField = $("#room-name");
    messageField = $("#input");
    
    nowPlayingUserField = $("#now-playing-user");
    nowPlayingTitleField = $("#now-playing-title");

    muteAudioButton = $("#mute-audio");
    hideVideoButton = $("#hide-video");
    
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
        setRoomAudioMuted(!roomAudioMuted);
    });
    
    
    $("#hide-video").on('click', function () {
        setRoomVideoHidden(!roomVideoHidden, true);
    });
    

    CHABBLE.YouTubeClient.OnVideoFinished(function () {
        setRoomVideoHidden(true);
        setNowPlaying('Nobody', 'anything');
    });

    CHABBLE.YouTubeClient.OnPlayerReady(function () {
        var audioCookie = readCookie("audioMuted");
        if (audioCookie !== null && audioCookie === "true")
            setRoomAudioMuted(true);
        else
            setRoomAudioMuted(false);
        
        
        var videoCookie = readCookie("videoHidden");
        if (videoCookie !== null && videoCookie === "true")
            setRoomVideoHidden(true,true);
        else
            setRoomVideoHidden(false,true);
    });

    CHABBLE.YouTubeClient.Init();
});

function setToolbarIconCrossState(target, displayCross) {
    var icon = target.find(".fa-ban");
    if (displayCross) {
        icon.show();
    } else {
        icon.hide();
    }
}

function setRoomAudioMuted(muted) {
    if (muted) {
        CHABBLE.YouTubeClient.Mute();
    } else {
        CHABBLE.YouTubeClient.UnMute();
    }
    createCookie("audioMuted", muted, 30);
    setToolbarIconCrossState(muteAudioButton, muted);
    roomAudioMuted = muted;
}

function setRoomVideoHidden(hidden, setDefault) {
    if (setDefault) {
        setToolbarIconCrossState(hideVideoButton, hidden);
        roomVideoHidden = hidden;
        createCookie("videoHidden", hidden, 30);
    }

    if (!roomVideoHidden && !hidden && CHABBLE.YouTubeClient.IsPlaying())
        youtubeContainer.show(250);
    else
        youtubeContainer.hide(250);
}


function playYoutubeVideo(videoId, offset, user, title) {
    setRoomVideoHidden(false);
    setNowPlaying(user, title);
    CHABBLE.YouTubeClient.Play(videoId, offset);
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