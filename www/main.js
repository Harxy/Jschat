$(function () {
    var roomArray = window.location.pathname.split('/');
    var roomName = roomArray[2];
    var client = new Faye.Client('/faye');

    getLastUsername();
    getLastTheme();

    subscribeToRoom(client, roomName);
    loadHistory(roomName);


    setLastRoomName(roomName);
    getRecentRoomNames(roomName);


    $('#theme-picker').change(function () {
        setTheme(this.value);
    });

    var $input = $('#input');
    var $name = $('#name');
    $input.keyup(function (e) {
        var message = $input.val();
        var userName = $name.val();
        if (e.keyCode === 13 && message != null && message != '') {
            sendMessage(client, roomName, userName, message);
            $input.val('');
        }
    });
    $input.focus();
});

function getLastUsername() {
    var userName = readCookie("username");
    var $name = $('#name');
    if (userName)
        $name.val(userName);
    else
        $name.val("Anon");
}

function setTheme(theme) {
    $('body').removeClass()
        .addClass(theme);

    createCookie("theme", theme, 30);
}

function getLastTheme() {
    var storedTheme = readCookie("theme");
    if (storedTheme) {
        $('#theme-picker').val(storedTheme);
        setTheme(storedTheme);
    }
}


function subscribeToRoom(client, roomName) {
    client.subscribe('/rooms/' + roomName, function (message) {
        addToScreen(message.name, message.text, message.timeString);
        $.titleAlert("New!", {
            requireBlur: true,
            stopOnFocus: true,
            interval: 700
        });
    });

}

function sendMessage(client, roomName, username, message) {
    var time = new Date();
    var timeString = time.toTimeString().split(' ')[0];

    client.publish('/rooms/' + roomName, {
        text: message,
        name: username,
        timeString: timeString
    });

    createCookie("username", username, 30);

}

function loadHistory(roomName) {
    $.getJSON("/history/" + roomName, function (messages) {
        messages.reverse();
        $.each(messages, function (key, message) {
            addToScreen(
                message.data.name,
                message.data.text,
                message.data.timeString
            );
        });
    });
}

function addToScreen(name, message, timeString) {
    var $newMessage = $('<div class="message"></div>')
        .append('<div class="name">' + name + '<span>' + timeString + '</span></div>')
        .append('<div class="body">' + message + '</div>');
    $('#output').prepend($newMessage);
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
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}
function getRecentRoomNames(currentRoomName) {
  var $lastRooms = $('#lastRoom');
  var roomArray = [readCookie("lastRoom"), readCookie("secondRoom"), readCookie("thirdRoom")];
  for (var i = 0; i < roomArray.length; i++) {
      if (roomArray[i] != 'undefined' && currentRoomName !== null)
        $lastRooms.append(" || <a href='/rooms/" + roomArray[i] + "'>#" + roomArray[i] + "</a>");
    else
        $lastRooms.append("");
  }

}

function setLastRoomName(roomName) {
  if (roomName != 'undefined' && roomName !== null) {
    if (roomName != readCookie('lastRoom') && roomName != readCookie('secondRoom')){
      createCookie('thirdRoom', readCookie('secondRoom'), 30);
      createCookie('secondRoom', readCookie('lastRoom'), 30);
      createCookie('lastRoom', roomName, 30);
    }
  }
}
