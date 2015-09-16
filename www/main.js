$(function () {
    var roomArray = window.location.pathname.split('/');
    roomName = roomArray[2];
    var client = new Faye.Client('/faye');

    getLastUsername();
    getLastTheme();

    subscribeToRoom(client, roomName);
    loadHistory();


    setLastRoomName(roomName);
    getRecentRoomNames();


    $('#theme-picker').change(function () {
        setTheme(this.value);
    });
    $('#input').keyup(function (e) {
        var message = $('#input').val();
        var userName = $('#name').val();
        if (e.keyCode === 13 && message != null && message != '') {
            sendMessage(client, roomName, userName, message);
            $('#input').val('');
        }
    });


    $('#input').focus();
});

function getLastUsername() {
    var userName = readCookie("username");
    if (userName)
        $('#name').val(userName);
    else
        $('#name').val("Anon");
}

function setTheme(theme) {
    $('body').removeClass();
    $('body').addClass(theme);

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

function loadHistory() {
    $.getJSON("/history/" + roomName, function (data) {
        data.reverse();
        $.each(data, function (key, val) {
            addToScreen(data[key].data.name, data[key].data.text, data[key].data.timeString);
        });
    });
}

function addToScreen(name, message, timeString) {
    if (twemoji.parse) {
        message = twemoji.parse(message, {size: 16});
    }
    $('#output').prepend('<div class="message"><div class="name">' + name + '<span>' + timeString + '</span></div><div class="body">' + message + '</div></div>');
}


function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
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
function getRecentRoomNames() {
  var roomArray = [readCookie("lastRoom"), readCookie("secondRoom"), readCookie("thirdRoom")];
  for (var i = 0; i < roomArray.length; i++) {
    if (roomArray[i] != 'undefined' && roomName !== null)
        $('#lastRoom').append(" || <a href='/rooms/" + roomArray[i] + "'>#" + roomArray[i] + "</a>");
    else
        $('#lastRoom').append("");
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
